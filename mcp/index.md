# 深入理解MCP：Model Context Protocol架构解析与开发实践


> 📝 **前言**：MCP（Model Context Protocol）是由Anthropic发布的开放标准，旨在标准化AI助手与数据源之间的连接方式。本文将深入解析MCP的架构原理、开发模式和实际应用，帮助开发者理解和使用这一革命性的协议。

## 🎯 什么是MCP？

### 定义与概念

**Model Context Protocol (MCP)** 是一个开放的协议标准，它标准化了应用程序向大语言模型（LLM）提供上下文的方式。

#### 形象比喻
如果把MCP比作USB-C接口：
- **USB-C**：为设备连接各种外设提供标准化接口
- **MCP**：为AI模型连接不同数据源和工具提供标准化协议

### 核心价值

```markdown
🎯 MCP解决的核心问题：
1. 数据孤岛：AI模型被困在信息孤岛中
2. 集成复杂：每个数据源需要定制化实现
3. 扩展困难：连接系统难以规模化
4. 维护成本：碎片化集成难以维护
```

## 🏗️ MCP架构深度解析

### 整体架构

MCP采用**客户端-服务器**架构，支持一个宿主应用连接多个服务器：

```mermaid
graph TB
    Host[MCP Host<br/>宿主应用] --> Client1[MCP Client 1]
    Host --> Client2[MCP Client 2]
    Host --> Client3[MCP Client 3]
    
    Client1 --> Server1[MCP Server 1<br/>文件系统]
    Client2 --> Server2[MCP Server 2<br/>数据库]
    Client3 --> Server3[MCP Server 3<br/>API服务]
    
    Server1 --> Data1[本地文件]
    Server2 --> Data2[PostgreSQL]
    Server3 --> Data3[外部API]
```

### 核心组件详解

#### 1. MCP Host（宿主）
```markdown
🏠 定义：运行AI模型的应用程序
📋 功能：
- 管理与多个MCP服务器的连接
- 协调AI模型与外部数据的交互
- 处理用户请求和响应

💡 典型示例：
- Claude Desktop
- VS Code插件
- 自定义AI应用
```

#### 2. MCP Client（客户端）
```markdown
🔌 定义：协议客户端，维护与服务器的1:1连接
📋 功能：
- 处理协议通信
- 管理连接状态
- 数据序列化/反序列化

🛠️ 实现方式：
- 通常内嵌在Host应用中
- 使用官方SDK开发
- 支持多种传输协议
```

#### 3. MCP Server（服务器）
```markdown
⚙️ 定义：轻量级程序，通过标准协议暴露特定能力
📋 功能：
- 提供Resources（资源）
- 暴露Tools（工具）
- 实现Prompts（提示模板）

🌟 特点：
- 单一职责原则
- 标准化接口
- 易于部署和维护
```

### 通信机制

#### 传输层（Transport）
```json
{
  "jsonrpc": "2.0",
  "method": "resources/list",
  "id": 1,
  "params": {}
}
```

MCP支持多种传输方式：

#### 标准输入/输出（stdio）
```python
# 启动stdio传输的MCP服务器
import sys
import asyncio
from mcp.server.stdio import stdio_server

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await run_server(read_stream, write_stream)

if __name__ == "__main__":
    asyncio.run(main())
```

#### HTTP传输
```python
# HTTP传输配置
from mcp.server.fastapi import create_mcp_app
from fastapi import FastAPI

app = FastAPI()
mcp_app = create_mcp_app(MyMcpServer())
app.mount("/mcp", mcp_app)

# 启动HTTP服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### WebSocket传输
```python
# WebSocket实时通信
import websockets
from mcp.server.websocket import websocket_server

async def handle_websocket(websocket, path):
    async with websocket_server(websocket) as server:
        await server.run()

start_server = websockets.serve(handle_websocket, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
```

#### 协议消息格式详解
```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "id": 1,
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      },
      "prompts": {
        "listChanged": true
      },
      "logging": {},
      "sampling": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

## 💻 MCP核心概念详解

### 协议生命周期管理

#### 1. 连接建立流程
```mermaid
sequenceDiagram
    participant Client
    participant Server
    
    Client->>Server: initialize request
    Server->>Client: initialize response
    Client->>Server: initialized notification
    Note over Client,Server: 连接建立完成
    
    Client->>Server: resources/list
    Server->>Client: resources list response
    
    Client->>Server: tools/list  
    Server->>Client: tools list response
    
    Note over Client,Server: 正常通信阶段
```

#### 2. 能力协商（Capabilities）
```python
class ServerCapabilities:
    def __init__(self):
        self.resources = ResourceCapabilities(
            subscribe=True,        # 支持资源订阅
            listChanged=True      # 支持列表变更通知
        )
        self.tools = ToolCapabilities(
            listChanged=True      # 支持工具列表变更
        )
        self.prompts = PromptCapabilities(
            listChanged=True      # 支持提示模板变更
        )
        self.logging = LoggingCapabilities()      # 日志功能
        self.sampling = SamplingCapabilities()   # 采样功能

# 服务器能力声明
async def handle_initialize(self, params):
    return InitializeResult(
        protocolVersion="2024-11-05",
        capabilities=self.get_capabilities(),
        serverInfo=ServerInfo(
            name="advanced-mcp-server",
            version="2.0.0"
        )
    )
```

### 1. Resources（资源）深度解析

#### 定义与作用
Resources是MCP服务器暴露给AI模型的**只读数据**，可以是文件、数据库记录、API响应等。

#### 资源类型系统
```python
from typing import Union, List, Dict, Any
from dataclasses import dataclass
from enum import Enum

class ResourceType(Enum):
    TEXT = "text"
    BINARY = "binary"
    JSON = "json"
    XML = "xml"
    CSV = "csv"
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"

@dataclass
class ResourceMetadata:
    """资源元数据"""
    size: int
    lastModified: str
    encoding: str
    language: str = None
    tags: List[str] = None
    permissions: Dict[str, bool] = None

@dataclass
class AdvancedResource:
    uri: str
    name: str
    description: str
    mimeType: str
    resourceType: ResourceType
    metadata: ResourceMetadata
    annotations: Dict[str, Any] = None
```

#### 高级资源实现
```python
class AdvancedResourceServer(McpServer):
    def __init__(self):
        super().__init__("advanced-resource-server")
        self.resource_cache = {}
        self.resource_subscribers = set()
        
    async def list_resources(self) -> List[AdvancedResource]:
        """列出所有可用资源"""
        resources = []
        
        # 动态扫描文件系统
        for file_path in self.scan_directory("/data"):
            resource = await self.create_resource_from_file(file_path)
            resources.append(resource)
            
        # 数据库资源
        db_resources = await self.get_database_resources()
        resources.extend(db_resources)
        
        # API资源
        api_resources = await self.get_api_resources()
        resources.extend(api_resources)
        
        return resources
    
    async def read_resource(self, uri: str) -> Union[str, bytes]:
        """读取资源内容，支持缓存和压缩"""
        # 检查缓存
        if uri in self.resource_cache:
            cache_entry = self.resource_cache[uri]
            if not self.is_cache_expired(cache_entry):
                return cache_entry['content']
        
        # 根据URI类型读取资源
        if uri.startswith("file://"):
            content = await self.read_file_resource(uri)
        elif uri.startswith("db://"):
            content = await self.read_database_resource(uri)
        elif uri.startswith("api://"):
            content = await self.read_api_resource(uri)
        else:
            raise ValueError(f"不支持的资源URI: {uri}")
        
        # 更新缓存
        self.resource_cache[uri] = {
            'content': content,
            'timestamp': time.time(),
            'size': len(content) if isinstance(content, str) else len(content)
        }
        
        return content
    
    async def subscribe_to_resource(self, uri: str) -> None:
        """订阅资源变更通知"""
        self.resource_subscribers.add(uri)
        # 启动文件监控
        await self.start_file_watcher(uri)
    
    async def notify_resource_changed(self, uri: str):
        """通知资源变更"""
        if uri in self.resource_subscribers:
            await self.send_notification("notifications/resources/updated", {
                "uri": uri,
                "timestamp": time.time()
            })
```

#### 实现示例
```python
# 文件系统资源服务器
from mcp import McpServer, Resource

class FileSystemServer(McpServer):
    async def list_resources(self):
        return [
            Resource(
                uri="file:///path/to/document.txt",
                name="项目文档",
                description="项目的详细说明文档",
                mimeType="text/plain"
            )
        ]
    
    async def read_resource(self, uri: str):
        if uri.startswith("file://"):
            path = uri[7:]  # 移除file://前缀
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
```

#### 应用场景
```markdown
📁 文件系统：
- 代码文件、文档、配置文件
- 支持多种文件格式（txt, md, json, etc.）

🗄️ 数据库：
- 表结构、查询结果
- 支持SQL和NoSQL数据库

🌐 Web资源：
- API响应、网页内容
- 实时数据抓取
```

### 2. Tools（工具）高级特性

#### 定义与作用
Tools允许AI模型**执行操作**，如文件写入、API调用、数据库更新等。

#### 工具参数验证系统
```python
from pydantic import BaseModel, validator, Field
from typing import Optional, Union, List
import jsonschema

class AdvancedToolParameter(BaseModel):
    """高级工具参数定义"""
    name: str
    type: str
    description: str
    required: bool = True
    default: Optional[Any] = None
    enum: Optional[List[str]] = None
    pattern: Optional[str] = None
    minimum: Optional[Union[int, float]] = None
    maximum: Optional[Union[int, float]] = None
    
    @validator('type')
    def validate_type(cls, v):
        valid_types = ['string', 'number', 'integer', 'boolean', 'array', 'object']
        if v not in valid_types:
            raise ValueError(f'Invalid type: {v}')
        return v

class AdvancedTool(BaseModel):
    """高级工具定义"""
    name: str
    description: str
    parameters: List[AdvancedToolParameter]
    examples: Optional[List[Dict[str, Any]]] = None
    category: str = "general"
    tags: List[str] = []
    timeout: int = 30  # 超时时间（秒）
    retryable: bool = True
    permissions: List[str] = []
    
    def validate_input(self, arguments: Dict[str, Any]) -> None:
        """验证输入参数"""
        schema = self.generate_json_schema()
        try:
            jsonschema.validate(arguments, schema)
        except jsonschema.ValidationError as e:
            raise ValueError(f"参数验证失败: {e.message}")
    
    def generate_json_schema(self) -> Dict[str, Any]:
        """生成JSON Schema用于参数验证"""
        properties = {}
        required = []
        
        for param in self.parameters:
            prop = {
                "type": param.type,
                "description": param.description
            }
            
            if param.enum:
                prop["enum"] = param.enum
            if param.pattern:
                prop["pattern"] = param.pattern
            if param.minimum is not None:
                prop["minimum"] = param.minimum
            if param.maximum is not None:
                prop["maximum"] = param.maximum
            if param.default is not None:
                prop["default"] = param.default
                
            properties[param.name] = prop
            
            if param.required:
                required.append(param.name)
        
        return {
            "type": "object",
            "properties": properties,
            "required": required
        }
```

#### 工具执行引擎
```python
import asyncio
from contextlib import asynccontextmanager
import time
from typing import AsyncGenerator

class ToolExecutionContext:
    """工具执行上下文"""
    def __init__(self, tool_name: str, client_id: str):
        self.tool_name = tool_name
        self.client_id = client_id
        self.start_time = time.time()
        self.execution_id = f"{tool_name}_{int(time.time())}"
        self.metadata = {}

class AdvancedToolServer(McpServer):
    def __init__(self):
        super().__init__("advanced-tool-server")
        self.tool_registry = {}
        self.execution_history = []
        self.concurrent_executions = {}
        
    def register_tool(self, tool: AdvancedTool, handler_func):
        """注册工具和处理函数"""
        self.tool_registry[tool.name] = {
            'tool': tool,
            'handler': handler_func
        }
    
    async def list_tools(self) -> List[AdvancedTool]:
        """列出所有注册的工具"""
        return [entry['tool'] for entry in self.tool_registry.values()]
    
    @asynccontextmanager
    async def execution_context(self, tool_name: str, client_id: str) -> AsyncGenerator[ToolExecutionContext, None]:
        """工具执行上下文管理器"""
        context = ToolExecutionContext(tool_name, client_id)
        self.concurrent_executions[context.execution_id] = context
        
        try:
            yield context
        finally:
            # 记录执行历史
            context.end_time = time.time()
            context.duration = context.end_time - context.start_time
            self.execution_history.append(context)
            
            # 清理并发执行记录
            del self.concurrent_executions[context.execution_id]
    
    async def call_tool(self, name: str, arguments: dict) -> ToolResult:
        """执行工具调用"""
        if name not in self.tool_registry:
            raise McpError(
                code=ErrorCode.METHOD_NOT_FOUND,
                message=f"工具 '{name}' 未找到"
            )
        
        tool_entry = self.tool_registry[name]
        tool = tool_entry['tool']
        handler = tool_entry['handler']
        
        # 参数验证
        try:
            tool.validate_input(arguments)
        except ValueError as e:
            raise McpError(
                code=ErrorCode.INVALID_PARAMS,
                message=str(e)
            )
        
        # 权限检查
        await self.check_tool_permissions(tool, self.get_current_client_id())
        
        # 执行工具
        async with self.execution_context(name, self.get_current_client_id()) as context:
            try:
                # 设置超时
                result = await asyncio.wait_for(
                    handler(arguments, context),
                    timeout=tool.timeout
                )
                return result
                
            except asyncio.TimeoutError:
                raise McpError(
                    code=ErrorCode.REQUEST_TIMEOUT,
                    message=f"工具执行超时 ({tool.timeout}秒)"
                )
            except Exception as e:
                if tool.retryable:
                    # 可重试的工具进行重试
                    return await self.retry_tool_execution(tool, handler, arguments, context)
                else:
                    raise McpError(
                        code=ErrorCode.INTERNAL_ERROR,
                        message=f"工具执行失败: {str(e)}"
                    )
    
    async def retry_tool_execution(self, tool: AdvancedTool, handler, arguments: dict, context: ToolExecutionContext, max_retries: int = 3) -> ToolResult:
        """重试工具执行"""
        for attempt in range(max_retries):
            try:
                await asyncio.sleep(2 ** attempt)  # 指数退避
                result = await asyncio.wait_for(
                    handler(arguments, context),
                    timeout=tool.timeout
                )
                return result
            except Exception as e:
                if attempt == max_retries - 1:
                    raise McpError(
                        code=ErrorCode.INTERNAL_ERROR,
                        message=f"工具执行失败（重试{max_retries}次后）: {str(e)}"
                    )
                continue
```

#### 工具组合与工作流
```python
class ToolWorkflow:
    """工具工作流编排"""
    def __init__(self, name: str):
        self.name = name
        self.steps = []
        self.conditions = {}
        
    def add_step(self, tool_name: str, arguments: dict, condition: Optional[callable] = None):
        """添加工作流步骤"""
        self.steps.append({
            'tool': tool_name,
            'arguments': arguments,
            'condition': condition
        })
    
    async def execute(self, tool_server: AdvancedToolServer, context: Dict[str, Any] = None) -> List[ToolResult]:
        """执行工作流"""
        results = []
        workflow_context = context or {}
        
        for step in self.steps:
            # 检查执行条件
            if step['condition'] and not step['condition'](workflow_context, results):
                continue
            
            # 动态参数替换
            arguments = self.resolve_arguments(step['arguments'], workflow_context, results)
            
            # 执行工具
            result = await tool_server.call_tool(step['tool'], arguments)
            results.append(result)
            
            # 更新上下文
            workflow_context[f"step_{len(results)}_result"] = result
        
        return results
    
    def resolve_arguments(self, arguments: dict, context: Dict[str, Any], results: List[ToolResult]) -> dict:
        """解析动态参数"""
        resolved = {}
        for key, value in arguments.items():
            if isinstance(value, str) and value.startswith("${"):
                # 动态参数解析
                var_name = value[2:-1]  # 移除 ${ 和 }
                if var_name in context:
                    resolved[key] = context[var_name]
                elif var_name.startswith("result_"):
                    # 引用之前的结果
                    index = int(var_name.split("_")[1]) - 1
                    if 0 <= index < len(results):
                        resolved[key] = results[index].content[0].text
                else:
                    resolved[key] = value
            else:
                resolved[key] = value
        return resolved

# 工作流使用示例
async def setup_code_analysis_workflow():
    workflow = ToolWorkflow("code_analysis")
    
    # 步骤1: 扫描代码文件
    workflow.add_step("scan_code_files", {
        "directory": "${target_directory}",
        "extensions": [".py", ".js", ".ts"]
    })
    
    # 步骤2: 分析代码复杂度
    workflow.add_step("analyze_complexity", {
        "files": "${result_1}"
    }, condition=lambda ctx, results: len(results) > 0 and results[0].isError == False)
    
    # 步骤3: 生成报告
    workflow.add_step("generate_report", {
        "analysis_data": "${result_2}",
        "format": "markdown"
    })
    
    return workflow
```

#### 实现示例
```python
from mcp import Tool, ToolResult

class DatabaseTool(McpServer):
    async def list_tools(self):
        return [
            Tool(
                name="execute_query",
                description="执行SQL查询",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "要执行的SQL查询"
                        }
                    },
                    "required": ["query"]
                }
            )
        ]
    
    async def call_tool(self, name: str, arguments: dict):
        if name == "execute_query":
            query = arguments["query"]
            # 执行数据库查询
            result = await self.db.execute(query)
            return ToolResult(
                content=[{"type": "text", "text": str(result)}],
                isError=False
            )
```

#### 安全考虑
```markdown
🔒 权限控制：
- 工具权限最小化原则
- 敏感操作需要确认
- 审计日志记录

⚠️ 输入验证：
- 参数类型检查
- SQL注入防护
- 文件路径验证
```

### 3. Prompts（提示模板）

#### 定义与作用
Prompts是可重用的提示模板，包含动态参数，用于标准化AI交互模式。

#### 实现示例
```python
from mcp import Prompt, PromptArgument

class CodeReviewServer(McpServer):
    async def list_prompts(self):
        return [
            Prompt(
                name="code_review",
                description="代码评审提示模板",
                arguments=[
                    PromptArgument(
                        name="code",
                        description="要评审的代码",
                        required=True
                    ),
                    PromptArgument(
                        name="language",
                        description="编程语言",
                        required=False
                    )
                ]
            )
        ]
    
    async def get_prompt(self, name: str, arguments: dict):
        if name == "code_review":
            code = arguments["code"]
            language = arguments.get("language", "未知")
            
            return f"""
请对以下{language}代码进行详细评审：

代码内容：
```{language}
{code}
```

请从以下几个方面进行分析：
1. 代码质量和规范性
2. 性能优化建议
3. 安全性问题
4. 可维护性改进
5. 最佳实践建议

请提供具体的修改建议和示例代码。
"""
```

## 🔒 MCP安全与中间件系统

### 认证与授权中间件

#### JWT认证中间件
```python
import jwt
from functools import wraps
from typing import Dict, Any, Optional

class JWTAuthMiddleware:
    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """验证JWT令牌"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise McpError(code=ErrorCode.UNAUTHORIZED, message="令牌已过期")
        except jwt.InvalidTokenError:
            raise McpError(code=ErrorCode.UNAUTHORIZED, message="无效令牌")
    
    def require_permission(self, permission: str):
        """权限装饰器"""
        def decorator(func):
            @wraps(func)
            async def wrapper(self, *args, **kwargs):
                client_token = self.get_client_token()
                payload = self.verify_token(client_token)
                
                user_permissions = payload.get('permissions', [])
                if permission not in user_permissions:
                    raise McpError(
                        code=ErrorCode.PERMISSION_DENIED,
                        message=f"缺少权限: {permission}"
                    )
                
                return await func(self, *args, **kwargs)
            return wrapper
        return decorator

class SecureServer(McpServer):
    def __init__(self):
        super().__init__("secure-server")
        self.auth_middleware = JWTAuthMiddleware(os.getenv("JWT_SECRET"))
    
    @auth_middleware.require_permission("read:resources")
    async def read_resource(self, uri: str):
        return await super().read_resource(uri)
    
    @auth_middleware.require_permission("execute:tools")
    async def call_tool(self, name: str, arguments: dict):
        return await super().call_tool(name, arguments)
```

#### 请求限流中间件
```python
import time
from collections import defaultdict, deque
from typing import DefaultDict

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: DefaultDict[str, deque] = defaultdict(deque)
    
    def is_allowed(self, client_id: str) -> bool:
        """检查是否允许请求"""
        now = time.time()
        client_requests = self.requests[client_id]
        
        # 清理过期请求
        while client_requests and client_requests[0] <= now - self.window_seconds:
            client_requests.popleft()
        
        # 检查请求数量
        if len(client_requests) >= self.max_requests:
            return False
        
        # 记录新请求
        client_requests.append(now)
        return True

class RateLimitedServer(McpServer):
    def __init__(self):
        super().__init__("rate-limited-server")
        self.rate_limiter = RateLimiter(max_requests=100, window_seconds=60)
    
    async def handle_request(self, method: str, params: dict):
        client_id = self.get_current_client_id()
        
        if not self.rate_limiter.is_allowed(client_id):
            raise McpError(
                code=ErrorCode.RATE_LIMITED,
                message="请求频率超限，请稍后重试"
            )
        
        return await super().handle_request(method, params)
```

### 数据加密与脱敏

#### 字段级加密
```python
from cryptography.fernet import Fernet
import base64
import json

class FieldEncryption:
    def __init__(self, encryption_key: bytes):
        self.cipher_suite = Fernet(encryption_key)
    
    def encrypt_field(self, data: str) -> str:
        """加密字段"""
        encrypted_data = self.cipher_suite.encrypt(data.encode())
        return base64.b64encode(encrypted_data).decode()
    
    def decrypt_field(self, encrypted_data: str) -> str:
        """解密字段"""
        decoded_data = base64.b64decode(encrypted_data.encode())
        decrypted_data = self.cipher_suite.decrypt(decoded_data)
        return decrypted_data.decode()

class DataMasking:
    """数据脱敏工具"""
    
    @staticmethod
    def mask_email(email: str) -> str:
        """邮箱脱敏"""
        if '@' not in email:
            return email
        local, domain = email.split('@', 1)
        masked_local = local[:2] + '*' * (len(local) - 2)
        return f"{masked_local}@{domain}"
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """电话号码脱敏"""
        if len(phone) < 7:
            return phone
        return phone[:3] + '*' * (len(phone) - 6) + phone[-3:]
    
    @staticmethod
    def mask_id_card(id_card: str) -> str:
        """身份证脱敏"""
        if len(id_card) < 8:
            return id_card
        return id_card[:4] + '*' * (len(id_card) - 8) + id_card[-4:]

class SecureDataServer(McpServer):
    def __init__(self):
        super().__init__("secure-data-server")
        self.field_encryption = FieldEncryption(Fernet.generate_key())
        self.data_masking = DataMasking()
    
    async def read_resource(self, uri: str) -> str:
        """读取资源并进行数据脱敏"""
        raw_data = await self.load_raw_data(uri)
        
        # 根据资源类型进行脱敏
        if uri.startswith("user://"):
            return self.mask_user_data(raw_data)
        elif uri.startswith("sensitive://"):
            return self.decrypt_and_mask_data(raw_data)
        
        return raw_data
    
    def mask_user_data(self, data: str) -> str:
        """用户数据脱敏"""
        try:
            user_data = json.loads(data)
            if 'email' in user_data:
                user_data['email'] = self.data_masking.mask_email(user_data['email'])
            if 'phone' in user_data:
                user_data['phone'] = self.data_masking.mask_phone(user_data['phone'])
            if 'id_card' in user_data:
                user_data['id_card'] = self.data_masking.mask_id_card(user_data['id_card'])
            return json.dumps(user_data, ensure_ascii=False)
        except json.JSONDecodeError:
            return data
```

## 🔄 MCP协议扩展

### 自定义协议扩展
```python
class CustomProtocolExtension:
    """自定义协议扩展"""
    
    def __init__(self, namespace: str):
        self.namespace = namespace
        self.custom_methods = {}
    
    def register_method(self, method_name: str, handler):
        """注册自定义方法"""
        full_method_name = f"{self.namespace}/{method_name}"
        self.custom_methods[full_method_name] = handler
    
    async def handle_custom_request(self, method: str, params: dict):
        """处理自定义请求"""
        if method in self.custom_methods:
            return await self.custom_methods[method](params)
        else:
            raise McpError(
                code=ErrorCode.METHOD_NOT_FOUND,
                message=f"自定义方法未找到: {method}"
            )

class ExtendedServer(McpServer):
    def __init__(self):
        super().__init__("extended-server")
        self.extension = CustomProtocolExtension("mycompany")
        self.setup_custom_methods()
    
    def setup_custom_methods(self):
        """设置自定义方法"""
        self.extension.register_method("bulk_upload", self.handle_bulk_upload)
        self.extension.register_method("stream_data", self.handle_stream_data)
        self.extension.register_method("batch_process", self.handle_batch_process)
    
    async def handle_bulk_upload(self, params: dict):
        """处理批量上传"""
        files = params.get('files', [])
        results = []
        
        for file_info in files:
            result = await self.upload_single_file(file_info)
            results.append(result)
        
        return {
            "uploaded": len(results),
            "results": results
        }
    
    async def handle_stream_data(self, params: dict):
        """处理流数据"""
        stream_id = params.get('stream_id')
        chunk_size = params.get('chunk_size', 1024)
        
        async for chunk in self.get_data_stream(stream_id, chunk_size):
            yield {
                "stream_id": stream_id,
                "chunk": chunk,
                "timestamp": time.time()
            }
```

### 事件驱动架构
```python
import asyncio
from typing import Callable, List
from dataclasses import dataclass

@dataclass
class McpEvent:
    """MCP事件"""
    type: str
    data: dict
    timestamp: float
    source: str

class EventBus:
    """事件总线"""
    
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = defaultdict(list)
        self.event_history: List[McpEvent] = []
    
    def subscribe(self, event_type: str, handler: Callable):
        """订阅事件"""
        self.subscribers[event_type].append(handler)
    
    def unsubscribe(self, event_type: str, handler: Callable):
        """取消订阅"""
        if handler in self.subscribers[event_type]:
            self.subscribers[event_type].remove(handler)
    
    async def publish(self, event: McpEvent):
        """发布事件"""
        self.event_history.append(event)
        
        # 通知所有订阅者
        handlers = self.subscribers.get(event.type, [])
        if handlers:
            await asyncio.gather(*[handler(event) for handler in handlers])
    
    def get_event_history(self, event_type: str = None, limit: int = 100) -> List[McpEvent]:
        """获取事件历史"""
        events = self.event_history
        if event_type:
            events = [e for e in events if e.type == event_type]
        return events[-limit:]

class EventDrivenServer(McpServer):
    def __init__(self):
        super().__init__("event-driven-server")
        self.event_bus = EventBus()
        self.setup_event_handlers()
    
    def setup_event_handlers(self):
        """设置事件处理器"""
        self.event_bus.subscribe("resource.created", self.on_resource_created)
        self.event_bus.subscribe("resource.updated", self.on_resource_updated)
        self.event_bus.subscribe("tool.executed", self.on_tool_executed)
        self.event_bus.subscribe("client.connected", self.on_client_connected)
    
    async def on_resource_created(self, event: McpEvent):
        """资源创建事件处理"""
        resource_uri = event.data.get('uri')
        await self.send_notification("notifications/resources/created", {
            "uri": resource_uri,
            "timestamp": event.timestamp
        })
    
    async def on_tool_executed(self, event: McpEvent):
        """工具执行事件处理"""
        tool_name = event.data.get('tool_name')
        execution_time = event.data.get('duration')
        
        # 记录性能指标
        await self.record_performance_metric(tool_name, execution_time)
        
        # 如果执行时间过长，发送警告
        if execution_time > 10:  # 10秒
            await self.send_notification("notifications/performance/warning", {
                "tool": tool_name,
                "duration": execution_time,
                "message": "工具执行时间过长"
            })

### 分布式MCP架构

#### 服务发现与负载均衡
```python
import consul
import hashlib
from typing import List, Dict, Optional

class ServiceDiscovery:
    """服务发现"""
    
    def __init__(self, consul_host: str = "localhost", consul_port: int = 8500):
        self.consul = consul.Consul(host=consul_host, port=consul_port)
        self.service_cache = {}
        self.cache_ttl = 30  # 缓存30秒
    
    async def register_service(self, service_name: str, host: str, port: int, tags: List[str] = None):
        """注册服务"""
        service_id = f"{service_name}-{host}-{port}"
        
        self.consul.agent.service.register(
            name=service_name,
            service_id=service_id,
            address=host,
            port=port,
            tags=tags or [],
            check=consul.Check.http(f"http://{host}:{port}/health", interval="10s")
        )
    
    async def discover_services(self, service_name: str) -> List[Dict]:
        """发现服务"""
        # 检查缓存
        cache_key = f"services:{service_name}"
        if cache_key in self.service_cache:
            cached_data = self.service_cache[cache_key]
            if time.time() - cached_data['timestamp'] < self.cache_ttl:
                return cached_data['services']
        
        # 从Consul获取服务列表
        _, services = self.consul.health.service(service_name, passing=True)
        
        service_list = []
        for service in services:
            service_info = service['Service']
            service_list.append({
                'id': service_info['ID'],
                'address': service_info['Address'],
                'port': service_info['Port'],
                'tags': service_info['Tags']
            })
        
        # 更新缓存
        self.service_cache[cache_key] = {
            'services': service_list,
            'timestamp': time.time()
        }
        
        return service_list

class LoadBalancer:
    """负载均衡器"""
    
    def __init__(self, strategy: str = "round_robin"):
        self.strategy = strategy
        self.round_robin_index = 0
        self.service_weights = {}
        self.service_health = {}
    
    def select_service(self, services: List[Dict], client_id: str = None) -> Optional[Dict]:
        """选择服务实例"""
        if not services:
            return None
        
        # 过滤健康的服务
        healthy_services = [s for s in services if self.service_health.get(s['id'], True)]
        
        if not healthy_services:
            return None
        
        if self.strategy == "round_robin":
            return self._round_robin_select(healthy_services)
        elif self.strategy == "weighted":
            return self._weighted_select(healthy_services)
        elif self.strategy == "consistent_hash":
            return self._consistent_hash_select(healthy_services, client_id)
        else:
            return healthy_services[0]
    
    def _round_robin_select(self, services: List[Dict]) -> Dict:
        """轮询选择"""
        service = services[self.round_robin_index % len(services)]
        self.round_robin_index += 1
        return service
    
    def _weighted_select(self, services: List[Dict]) -> Dict:
        """加权选择"""
        # 根据服务权重选择
        total_weight = sum(self.service_weights.get(s['id'], 1) for s in services)
        import random
        target = random.uniform(0, total_weight)
        
        current_weight = 0
        for service in services:
            current_weight += self.service_weights.get(service['id'], 1)
            if current_weight >= target:
                return service
        
        return services[0]
    
    def _consistent_hash_select(self, services: List[Dict], client_id: str) -> Dict:
        """一致性哈希选择"""
        if not client_id:
            return services[0]
        
        # 计算客户端ID的哈希值
        client_hash = int(hashlib.md5(client_id.encode()).hexdigest(), 16)
        
        # 为每个服务计算哈希值并找到最接近的
        service_hashes = []
        for service in services:
            service_key = f"{service['address']}:{service['port']}"
            service_hash = int(hashlib.md5(service_key.encode()).hexdigest(), 16)
            service_hashes.append((service_hash, service))
        
        # 排序并找到大于等于客户端哈希的第一个服务
        service_hashes.sort()
        for service_hash, service in service_hashes:
            if service_hash >= client_hash:
                return service
        
        # 如果没找到，返回第一个服务（环形结构）
        return service_hashes[0][1]

class DistributedMcpClient:
    """分布式MCP客户端"""
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.service_discovery = ServiceDiscovery()
        self.load_balancer = LoadBalancer(strategy="consistent_hash")
        self.circuit_breakers = {}
    
    async def call_service(self, method: str, params: dict, client_id: str = None):
        """调用分布式服务"""
        # 服务发现
        services = await self.service_discovery.discover_services(self.service_name)
        
        # 负载均衡选择服务
        selected_service = self.load_balancer.select_service(services, client_id)
        
        if not selected_service:
            raise McpError(
                code=ErrorCode.SERVICE_UNAVAILABLE,
                message=f"没有可用的 {self.service_name} 服务实例"
            )
        
        # 检查熔断器
        service_key = f"{selected_service['address']}:{selected_service['port']}"
        circuit_breaker = self.circuit_breakers.get(service_key)
        
        if circuit_breaker and circuit_breaker.is_open():
            raise McpError(
                code=ErrorCode.SERVICE_UNAVAILABLE,
                message=f"服务 {service_key} 熔断中"
            )
        
        try:
            # 调用远程服务
            result = await self.call_remote_service(selected_service, method, params)
            
            # 记录成功调用
            if circuit_breaker:
                circuit_breaker.record_success()
            
            return result
            
        except Exception as e:
            # 记录失败调用
            if circuit_breaker:
                circuit_breaker.record_failure()
            
            raise e

class CircuitBreaker:
    """熔断器"""
    
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def is_open(self) -> bool:
        """检查熔断器是否开启"""
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
                return False
            return True
        return False
    
    def record_success(self):
        """记录成功调用"""
        self.failure_count = 0
        self.state = "CLOSED"
    
    def record_failure(self):
        """记录失败调用"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

### 云原生部署方案

#### Kubernetes配置
```yaml
# mcp-server-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
  labels:
    app: mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-server
  template:
    metadata:
      labels:
        app: mcp-server
    spec:
      containers:
      - name: mcp-server
        image: myregistry/mcp-server:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: mcp-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: mcp-config
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: mcp-server-service
spec:
  selector:
    app: mcp-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mcp-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mcp-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

#### Helm Chart配置
```yaml
# values.yaml
replicaCount: 3

image:
  repository: myregistry/mcp-server
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80
  targetPort: 8000

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: mcp-api.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: mcp-api-tls
      hosts:
        - mcp-api.example.com

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

# 配置管理
config:
  database:
    url: postgresql://user:pass@postgres:5432/mcpdb
    pool_size: 20
    timeout: 30
  
  redis:
    url: redis://redis:6379/0
    ttl: 3600
  
  monitoring:
    enabled: true
    prometheus:
      enabled: true
      port: 9090
    
  security:
    jwt_secret: "your-secret-key"
    cors_origins:
      - "https://app.example.com"
             - "https://admin.example.com"
 ```

### 高级调试与诊断工具

#### MCP协议调试器
```python
import json
import asyncio
from typing import Dict, List, Any
from datetime import datetime

class McpProtocolDebugger:
    """MCP协议调试器"""
    
    def __init__(self, enable_trace: bool = True):
        self.enable_trace = enable_trace
        self.message_history: List[Dict] = []
        self.error_history: List[Dict] = []
        self.performance_metrics: Dict[str, List] = {}
    
    def trace_message(self, direction: str, message: Dict[str, Any]):
        """跟踪消息"""
        if not self.enable_trace:
            return
        
        trace_entry = {
            'timestamp': datetime.now().isoformat(),
            'direction': direction,  # 'incoming' 或 'outgoing'
            'message': message,
            'size': len(json.dumps(message).encode())
        }
        
        self.message_history.append(trace_entry)
        
        # 保持历史记录大小
        if len(self.message_history) > 1000:
            self.message_history = self.message_history[-1000:]
    
    def trace_error(self, error: Exception, context: Dict[str, Any] = None):
        """跟踪错误"""
        error_entry = {
            'timestamp': datetime.now().isoformat(),
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context or {}
        }
        
        self.error_history.append(error_entry)
        
        if len(self.error_history) > 100:
            self.error_history = self.error_history[-100:]
    
    def record_performance(self, operation: str, duration: float, metadata: Dict = None):
        """记录性能数据"""
        if operation not in self.performance_metrics:
            self.performance_metrics[operation] = []
        
        performance_entry = {
            'timestamp': datetime.now().isoformat(),
            'duration': duration,
            'metadata': metadata or {}
        }
        
        self.performance_metrics[operation].append(performance_entry)
        
        # 保持每个操作最多100条记录
        if len(self.performance_metrics[operation]) > 100:
            self.performance_metrics[operation] = self.performance_metrics[operation][-100:]
    
    def get_debug_report(self) -> Dict[str, Any]:
        """生成调试报告"""
        report = {
            'summary': {
                'total_messages': len(self.message_history),
                'total_errors': len(self.error_history),
                'performance_operations': len(self.performance_metrics)
            },
            'recent_messages': self.message_history[-10:],
            'recent_errors': self.error_history[-5:],
            'performance_summary': {}
        }
        
        # 性能摘要
        for operation, metrics in self.performance_metrics.items():
            if metrics:
                durations = [m['duration'] for m in metrics]
                report['performance_summary'][operation] = {
                    'count': len(durations),
                    'avg_duration': sum(durations) / len(durations),
                    'min_duration': min(durations),
                    'max_duration': max(durations)
                }
        
        return report
    
    def export_trace(self, filename: str = None):
        """导出跟踪数据"""
        if not filename:
            filename = f"mcp_trace_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        trace_data = {
            'messages': self.message_history,
            'errors': self.error_history,
            'performance': self.performance_metrics,
            'exported_at': datetime.now().isoformat()
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(trace_data, f, ensure_ascii=False, indent=2)
        
        return filename

class DebuggableMcpServer(McpServer):
    """可调试的MCP服务器"""
    
    def __init__(self, name: str, debug_mode: bool = False):
        super().__init__(name)
        self.debug_mode = debug_mode
        self.debugger = McpProtocolDebugger(enable_trace=debug_mode)
        self.request_id_counter = 0
    
    async def handle_request(self, method: str, params: dict):
        """处理请求（带调试功能）"""
        self.request_id_counter += 1
        request_id = f"req_{self.request_id_counter}"
        
        start_time = time.time()
        
        # 跟踪入站消息
        if self.debug_mode:
            self.debugger.trace_message('incoming', {
                'id': request_id,
                'method': method,
                'params': params
            })
        
        try:
            result = await super().handle_request(method, params)
            
            # 跟踪出站响应
            if self.debug_mode:
                self.debugger.trace_message('outgoing', {
                    'id': request_id,
                    'result': result
                })
            
            return result
            
        except Exception as e:
            # 跟踪错误
            self.debugger.trace_error(e, {
                'request_id': request_id,
                'method': method,
                'params': params
            })
            
            # 跟踪错误响应
            if self.debug_mode:
                self.debugger.trace_message('outgoing', {
                    'id': request_id,
                    'error': {
                        'code': getattr(e, 'code', -1),
                        'message': str(e)
                    }
                })
            
            raise
        
        finally:
            # 记录性能
            duration = time.time() - start_time
            self.debugger.record_performance(method, duration, {
                'request_id': request_id
            })
    
    async def get_debug_info(self) -> Dict[str, Any]:
        """获取调试信息"""
        return self.debugger.get_debug_report()
    
    async def export_debug_trace(self) -> str:
        """导出调试跟踪"""
        return self.debugger.export_trace()
```

### 智能错误恢复机制

#### 自动故障恢复
```python
import asyncio
from typing import Callable, Dict, Any, Optional
from enum import Enum

class RecoveryStrategy(Enum):
    """恢复策略"""
    RETRY = "retry"
    FALLBACK = "fallback"
    CIRCUIT_BREAKER = "circuit_breaker"
    GRACEFUL_DEGRADATION = "graceful_degradation"

class ErrorRecoveryManager:
    """错误恢复管理器"""
    
    def __init__(self):
        self.recovery_strategies: Dict[str, RecoveryStrategy] = {}
        self.fallback_handlers: Dict[str, Callable] = {}
        self.retry_policies: Dict[str, Dict] = {}
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
    
    def register_strategy(self, operation: str, strategy: RecoveryStrategy, **kwargs):
        """注册恢复策略"""
        self.recovery_strategies[operation] = strategy
        
        if strategy == RecoveryStrategy.RETRY:
            self.retry_policies[operation] = {
                'max_attempts': kwargs.get('max_attempts', 3),
                'delay': kwargs.get('delay', 1.0),
                'backoff_multiplier': kwargs.get('backoff_multiplier', 2.0),
                'max_delay': kwargs.get('max_delay', 30.0)
            }
        elif strategy == RecoveryStrategy.CIRCUIT_BREAKER:
            self.circuit_breakers[operation] = CircuitBreaker(
                failure_threshold=kwargs.get('failure_threshold', 5),
                timeout=kwargs.get('timeout', 60)
            )
    
    def register_fallback(self, operation: str, handler: Callable):
        """注册降级处理器"""
        self.fallback_handlers[operation] = handler
    
    async def execute_with_recovery(self, operation: str, func: Callable, *args, **kwargs):
        """带恢复机制的执行"""
        strategy = self.recovery_strategies.get(operation, RecoveryStrategy.RETRY)
        
        if strategy == RecoveryStrategy.RETRY:
            return await self._execute_with_retry(operation, func, *args, **kwargs)
        elif strategy == RecoveryStrategy.FALLBACK:
            return await self._execute_with_fallback(operation, func, *args, **kwargs)
        elif strategy == RecoveryStrategy.CIRCUIT_BREAKER:
            return await self._execute_with_circuit_breaker(operation, func, *args, **kwargs)
        elif strategy == RecoveryStrategy.GRACEFUL_DEGRADATION:
            return await self._execute_with_degradation(operation, func, *args, **kwargs)
        else:
            return await func(*args, **kwargs)
    
    async def _execute_with_retry(self, operation: str, func: Callable, *args, **kwargs):
        """重试执行"""
        policy = self.retry_policies.get(operation, {})
        max_attempts = policy.get('max_attempts', 3)
        delay = policy.get('delay', 1.0)
        backoff_multiplier = policy.get('backoff_multiplier', 2.0)
        max_delay = policy.get('max_delay', 30.0)
        
        last_exception = None
        current_delay = delay
        
        for attempt in range(max_attempts):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                
                if attempt < max_attempts - 1:
                    await asyncio.sleep(current_delay)
                    current_delay = min(current_delay * backoff_multiplier, max_delay)
        
        # 所有重试都失败，抛出最后一个异常
        raise last_exception
    
    async def _execute_with_fallback(self, operation: str, func: Callable, *args, **kwargs):
        """降级执行"""
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            fallback_handler = self.fallback_handlers.get(operation)
            if fallback_handler:
                return await fallback_handler(*args, **kwargs)
            raise e
    
    async def _execute_with_circuit_breaker(self, operation: str, func: Callable, *args, **kwargs):
        """熔断器执行"""
        circuit_breaker = self.circuit_breakers.get(operation)
        if not circuit_breaker:
            return await func(*args, **kwargs)
        
        if circuit_breaker.is_open():
            raise McpError(
                code=ErrorCode.SERVICE_UNAVAILABLE,
                message=f"服务 {operation} 熔断中"
            )
        
        try:
            result = await func(*args, **kwargs)
            circuit_breaker.record_success()
            return result
        except Exception as e:
            circuit_breaker.record_failure()
            raise e
    
    async def _execute_with_degradation(self, operation: str, func: Callable, *args, **kwargs):
        """优雅降级执行"""
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            # 记录错误但返回降级结果
            fallback_handler = self.fallback_handlers.get(operation)
            if fallback_handler:
                try:
                    return await fallback_handler(*args, **kwargs)
                except Exception:
                    # 降级也失败，返回默认值
                    return self._get_default_response(operation)
            
            return self._get_default_response(operation)
    
    def _get_default_response(self, operation: str):
        """获取默认响应"""
        if operation.startswith('read_'):
            return ""
        elif operation.startswith('list_'):
            return []
        elif operation.startswith('call_'):
            return ToolResult(
                content=[TextContent(type="text", text="服务暂时不可用")],
                isError=True
            )
        else:
            return None

class ResilientMcpServer(McpServer):
    """具有错误恢复能力的MCP服务器"""
    
    def __init__(self, name: str):
        super().__init__(name)
        self.recovery_manager = ErrorRecoveryManager()
        self.setup_recovery_strategies()
    
    def setup_recovery_strategies(self):
        """设置恢复策略"""
        # 资源读取使用重试策略
        self.recovery_manager.register_strategy(
            'read_resource',
            RecoveryStrategy.RETRY,
            max_attempts=3,
            delay=1.0,
            backoff_multiplier=2.0
        )
        
        # 工具调用使用熔断器
        self.recovery_manager.register_strategy(
            'call_tool',
            RecoveryStrategy.CIRCUIT_BREAKER,
            failure_threshold=5,
            timeout=60
        )
        
        # 注册降级处理器
        self.recovery_manager.register_fallback(
            'read_resource',
            self.fallback_read_resource
        )
        
        self.recovery_manager.register_fallback(
            'call_tool',
            self.fallback_call_tool
        )
    
    async def read_resource(self, uri: str) -> str:
        """带恢复机制的资源读取"""
        return await self.recovery_manager.execute_with_recovery(
            'read_resource',
            super().read_resource,
            uri
        )
    
    async def call_tool(self, name: str, arguments: dict) -> ToolResult:
        """带恢复机制的工具调用"""
        return await self.recovery_manager.execute_with_recovery(
            'call_tool',
            super().call_tool,
            name,
            arguments
        )
    
    async def fallback_read_resource(self, uri: str) -> str:
        """资源读取降级处理"""
        return f"资源 {uri} 暂时不可用，请稍后重试"
    
    async def fallback_call_tool(self, name: str, arguments: dict) -> ToolResult:
        """工具调用降级处理"""
        return ToolResult(
            content=[TextContent(
                type="text",
                text=f"工具 {name} 暂时不可用，请稍后重试"
            )],
            isError=True
        )
```

### 多租户支持

#### 租户隔离机制
```python
from typing import Dict, Set, Optional
import hashlib

class TenantManager:
    """租户管理器"""
    
    def __init__(self):
        self.tenants: Dict[str, Dict] = {}
        self.tenant_resources: Dict[str, Set[str]] = {}
        self.tenant_quotas: Dict[str, Dict] = {}
        self.tenant_usage: Dict[str, Dict] = {}
    
    def create_tenant(self, tenant_id: str, config: Dict):
        """创建租户"""
        self.tenants[tenant_id] = {
            'id': tenant_id,
            'name': config.get('name', tenant_id),
            'created_at': time.time(),
            'status': 'active',
            'config': config
        }
        
        # 初始化资源和配额
        self.tenant_resources[tenant_id] = set()
        self.tenant_quotas[tenant_id] = {
            'max_resources': config.get('max_resources', 100),
            'max_requests_per_minute': config.get('max_requests_per_minute', 1000),
            'max_storage_mb': config.get('max_storage_mb', 1024)
        }
        self.tenant_usage[tenant_id] = {
            'resources_count': 0,
            'requests_count': 0,
            'storage_used_mb': 0,
            'last_reset': time.time()
        }
    
    def get_tenant(self, tenant_id: str) -> Optional[Dict]:
        """获取租户信息"""
        return self.tenants.get(tenant_id)
    
    def check_quota(self, tenant_id: str, resource_type: str, amount: int = 1) -> bool:
        """检查配额"""
        if tenant_id not in self.tenant_quotas:
            return False
        
        quota = self.tenant_quotas[tenant_id]
        usage = self.tenant_usage[tenant_id]
        
        # 重置每分钟的请求计数
        current_time = time.time()
        if current_time - usage['last_reset'] >= 60:
            usage['requests_count'] = 0
            usage['last_reset'] = current_time
        
        if resource_type == 'requests':
            return usage['requests_count'] + amount <= quota['max_requests_per_minute']
        elif resource_type == 'resources':
            return usage['resources_count'] + amount <= quota['max_resources']
        elif resource_type == 'storage':
            return usage['storage_used_mb'] + amount <= quota['max_storage_mb']
        
        return True
    
    def consume_quota(self, tenant_id: str, resource_type: str, amount: int = 1):
        """消费配额"""
        if tenant_id not in self.tenant_usage:
            return
        
        usage = self.tenant_usage[tenant_id]
        
        if resource_type == 'requests':
            usage['requests_count'] += amount
        elif resource_type == 'resources':
            usage['resources_count'] += amount
        elif resource_type == 'storage':
            usage['storage_used_mb'] += amount
    
    def get_tenant_namespace(self, tenant_id: str, resource_name: str) -> str:
        """获取租户命名空间的资源名"""
        return f"tenant:{tenant_id}:{resource_name}"

class MultiTenantMcpServer(McpServer):
    """多租户MCP服务器"""
    
    def __init__(self, name: str):
        super().__init__(name)
        self.tenant_manager = TenantManager()
        self.tenant_contexts: Dict[str, str] = {}  # 连接ID -> 租户ID映射
    
    async def authenticate_tenant(self, token: str) -> Optional[str]:
        """租户认证"""
        # 这里应该实现实际的JWT验证逻辑
        # 为简化示例，直接从token中提取租户ID
        try:
            # 假设token格式为 "tenant_id:signature"
            tenant_id = token.split(':')[0]
            if self.tenant_manager.get_tenant(tenant_id):
                return tenant_id
        except Exception:
            pass
        return None
    
    async def handle_request(self, method: str, params: dict):
        """处理多租户请求"""
        # 获取当前连接的租户ID
        connection_id = self.get_current_connection_id()
        tenant_id = self.tenant_contexts.get(connection_id)
        
        if not tenant_id:
            raise McpError(
                code=ErrorCode.UNAUTHORIZED,
                message="需要租户认证"
            )
        
        # 检查请求配额
        if not self.tenant_manager.check_quota(tenant_id, 'requests'):
            raise McpError(
                code=ErrorCode.RATE_LIMITED,
                message="租户请求配额已用完"
            )
        
        # 消费配额
        self.tenant_manager.consume_quota(tenant_id, 'requests')
        
        # 在请求参数中注入租户上下文
        params['_tenant_id'] = tenant_id
        
        return await super().handle_request(method, params)
    
    async def read_resource(self, uri: str) -> str:
        """多租户资源读取"""
        tenant_id = self._get_current_tenant_id()
        
        # 添加租户命名空间
        namespaced_uri = self.tenant_manager.get_tenant_namespace(tenant_id, uri)
        
        return await super().read_resource(namespaced_uri)
    
    async def list_resources(self) -> List[Resource]:
        """列出租户资源"""
        tenant_id = self._get_current_tenant_id()
        
        # 获取所有资源并过滤租户资源
        all_resources = await super().list_resources()
        tenant_prefix = f"tenant:{tenant_id}:"
        
        tenant_resources = []
        for resource in all_resources:
            if resource.uri.startswith(tenant_prefix):
                # 移除租户前缀，返回原始URI
                original_uri = resource.uri[len(tenant_prefix):]
                tenant_resources.append(Resource(
                    uri=original_uri,
                    name=resource.name,
                    description=resource.description,
                    mimeType=resource.mimeType
                ))
        
        return tenant_resources
    
    def _get_current_tenant_id(self) -> str:
        """获取当前租户ID"""
        connection_id = self.get_current_connection_id()
        tenant_id = self.tenant_contexts.get(connection_id)
        if not tenant_id:
            raise McpError(
                code=ErrorCode.UNAUTHORIZED,
                message="未找到租户上下文"
            )
        return tenant_id
    
    async def create_tenant(self, tenant_config: Dict) -> str:
        """创建新租户"""
        tenant_id = tenant_config.get('id') or self._generate_tenant_id()
        self.tenant_manager.create_tenant(tenant_id, tenant_config)
        return tenant_id
    
    def _generate_tenant_id(self) -> str:
        """生成租户ID"""
        import uuid
        return str(uuid.uuid4())
    
    async def get_tenant_usage(self, tenant_id: str) -> Dict:
        """获取租户使用情况"""
        usage = self.tenant_manager.tenant_usage.get(tenant_id, {})
        quota = self.tenant_manager.tenant_quotas.get(tenant_id, {})
        
        return {
            'usage': usage,
            'quota': quota,
            'utilization': {
                'requests': usage.get('requests_count', 0) / max(quota.get('max_requests_per_minute', 1), 1),
                'resources': usage.get('resources_count', 0) / max(quota.get('max_resources', 1), 1),
                'storage': usage.get('storage_used_mb', 0) / max(quota.get('max_storage_mb', 1), 1)
            }
        }
```

## 🛠️ MCP开发实践

### 开发环境搭建

#### 1. 安装开发工具
```bash
# Python环境
pip install mcp

# TypeScript环境
npm install @modelcontextprotocol/sdk

# 调试工具
npm install -g @modelcontextprotocol/inspector
```

#### 2. 项目结构
```
my-mcp-server/
├── src/
│   ├── __init__.py
│   ├── server.py          # 主服务器代码
│   ├── resources.py       # 资源处理
│   ├── tools.py          # 工具实现
│   └── prompts.py        # 提示模板
├── config/
│   └── server_config.json
├── tests/
│   └── test_server.py
├── requirements.txt
└── README.md
```

### 开发最佳实践

#### 1. 服务器设计原则
```python
from mcp import McpServer
from typing import List, Optional
import asyncio

class BestPracticeServer(McpServer):
    def __init__(self):
        super().__init__("best-practice-server")
        self.name = "最佳实践服务器"
        self.version = "1.0.0"
    
    async def initialize(self):
        """初始化服务器资源"""
        self.logger.info("服务器初始化中...")
        # 初始化数据库连接、缓存等
        
    async def cleanup(self):
        """清理资源"""
        self.logger.info("服务器清理中...")
        # 关闭连接、清理缓存等
```

#### 2. 错误处理
```python
from mcp import McpError, ErrorCode

async def safe_tool_call(self, name: str, arguments: dict):
    try:
        # 工具执行逻辑
        result = await self.execute_tool(name, arguments)
        return result
    except ValidationError as e:
        raise McpError(
            code=ErrorCode.INVALID_PARAMS,
            message=f"参数验证失败: {str(e)}"
        )
    except PermissionError as e:
        raise McpError(
            code=ErrorCode.PERMISSION_DENIED,
            message="权限不足"
        )
    except Exception as e:
        self.logger.error(f"工具执行失败: {str(e)}")
        raise McpError(
            code=ErrorCode.INTERNAL_ERROR,
            message="内部服务器错误"
        )
```

#### 3. 性能优化
```python
import asyncio
from functools import lru_cache

class OptimizedServer(McpServer):
    @lru_cache(maxsize=100)
    async def get_cached_resource(self, uri: str):
        """缓存资源内容"""
        return await self.load_resource(uri)
    
    async def batch_process_resources(self, uris: List[str]):
        """批量处理资源"""
        tasks = [self.get_cached_resource(uri) for uri in uris]
        return await asyncio.gather(*tasks)
```

### 调试与测试

#### 1. 使用MCP Inspector
```bash
# 启动调试工具
npx @modelcontextprotocol/inspector

# 测试服务器连接
mcp-inspector --server python my_server.py
```

#### 2. 单元测试
```python
import pytest
from mcp.testing import McpTestClient

@pytest.mark.asyncio
async def test_resource_listing():
    client = McpTestClient(MyMcpServer())
    await client.connect()
    
    resources = await client.list_resources()
    assert len(resources) > 0
    assert resources[0].name == "测试资源"
```

## 🔧 实际应用案例

### 案例一：代码库分析服务器

#### 需求分析
为AI模型提供代码库的完整上下文，包括文件结构、代码内容、Git历史等。

#### 实现方案
```python
class CodebaseServer(McpServer):
    def __init__(self, repo_path: str):
        super().__init__("codebase-server")
        self.repo_path = repo_path
        self.git_repo = GitRepository(repo_path)
    
    async def list_resources(self):
        """列出代码库中的所有文件"""
        files = []
        for root, dirs, filenames in os.walk(self.repo_path):
            for filename in filenames:
                if self.is_code_file(filename):
                    file_path = os.path.join(root, filename)
                    relative_path = os.path.relpath(file_path, self.repo_path)
                    files.append(Resource(
                        uri=f"file://{file_path}",
                        name=relative_path,
                        description=f"代码文件: {relative_path}",
                        mimeType=self.get_mime_type(filename)
                    ))
        return files
    
    async def list_tools(self):
        return [
            Tool(
                name="analyze_code_structure",
                description="分析代码结构和依赖关系",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "file_pattern": {
                            "type": "string",
                            "description": "文件匹配模式"
                        }
                    }
                }
            ),
            Tool(
                name="get_git_history",
                description="获取Git提交历史",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "file_path": {
                            "type": "string",
                            "description": "文件路径"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "历史记录数量限制"
                        }
                    }
                }
            )
        ]
```

### 案例二：数据库管理服务器

#### 功能特性
- 数据库连接管理
- SQL查询执行
- 表结构分析
- 数据安全保护

#### 实现代码
```python
import asyncpg
from typing import Dict, Any

class DatabaseServer(McpServer):
    def __init__(self, db_config: Dict[str, Any]):
        super().__init__("database-server")
        self.db_config = db_config
        self.connection_pool = None
    
    async def initialize(self):
        """初始化数据库连接池"""
        self.connection_pool = await asyncpg.create_pool(
            **self.db_config,
            min_size=1,
            max_size=10
        )
    
    async def list_resources(self):
        """列出数据库表和视图"""
        async with self.connection_pool.acquire() as conn:
            tables = await conn.fetch("""
                SELECT table_name, table_type 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            
            return [
                Resource(
                    uri=f"table://{table['table_name']}",
                    name=table['table_name'],
                    description=f"数据库{table['table_type']}: {table['table_name']}",
                    mimeType="application/sql"
                )
                for table in tables
            ]
    
    async def call_tool(self, name: str, arguments: dict):
        if name == "execute_query":
            query = arguments["query"]
            
            # 安全检查
            if not self.is_safe_query(query):
                raise McpError(
                    code=ErrorCode.PERMISSION_DENIED,
                    message="查询包含不安全的操作"
                )
            
            async with self.connection_pool.acquire() as conn:
                try:
                    result = await conn.fetch(query)
                    return ToolResult(
                        content=[{
                            "type": "text",
                            "text": self.format_query_result(result)
                        }]
                    )
                except Exception as e:
                    return ToolResult(
                        content=[{
                            "type": "text", 
                            "text": f"查询执行失败: {str(e)}"
                        }],
                        isError=True
                    )
    
    def is_safe_query(self, query: str) -> bool:
        """检查查询是否安全"""
        dangerous_keywords = [
            'DROP', 'DELETE', 'UPDATE', 'INSERT', 
            'ALTER', 'CREATE', 'TRUNCATE'
        ]
        query_upper = query.upper()
        return not any(keyword in query_upper for keyword in dangerous_keywords)
```

### 案例三：文档知识库服务器

#### 应用场景
为AI助手提供企业内部文档、知识库的访问能力。

#### 核心实现
```python
from pathlib import Path
import markdown
from bs4 import BeautifulSoup

class KnowledgeBaseServer(McpServer):
    def __init__(self, docs_path: str):
        super().__init__("knowledge-base-server")
        self.docs_path = Path(docs_path)
        self.doc_index = {}
        
    async def initialize(self):
        """构建文档索引"""
        await self.build_document_index()
    
    async def build_document_index(self):
        """构建文档索引以支持快速搜索"""
        for doc_file in self.docs_path.rglob("*.md"):
            content = doc_file.read_text(encoding='utf-8')
            # 提取标题和关键词
            html = markdown.markdown(content)
            soup = BeautifulSoup(html, 'html.parser')
            
            self.doc_index[str(doc_file)] = {
                'title': self.extract_title(soup),
                'keywords': self.extract_keywords(content),
                'summary': self.generate_summary(content)
            }
    
    async def list_prompts(self):
        return [
            Prompt(
                name="document_qa",
                description="文档问答提示模板",
                arguments=[
                    PromptArgument(
                        name="question",
                        description="用户问题",
                        required=True
                    ),
                    PromptArgument(
                        name="context_docs",
                        description="相关文档",
                        required=False
                    )
                ]
            )
        ]
    
    async def get_prompt(self, name: str, arguments: dict):
        if name == "document_qa":
            question = arguments["question"]
            context_docs = arguments.get("context_docs", "")
            
            return f"""
基于以下文档内容回答用户问题。

相关文档：
{context_docs}

用户问题：{question}

请基于文档内容提供准确、详细的回答。如果文档中没有相关信息，请明确说明。
"""
```

## 🏢 企业级部署方案

### 部署架构

#### 1. 本地部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./data:/app/data
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mcpdata
      POSTGRES_USER: mcpuser
      POSTGRES_PASSWORD: mcppass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

#### 2. 云端部署
```bash
# Kubernetes部署示例
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-server
  template:
    metadata:
      labels:
        app: mcp-server
    spec:
      containers:
      - name: mcp-server
        image: my-org/mcp-server:latest
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          value: "postgres-service"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
EOF
```

### 安全最佳实践

#### 1. 认证授权
```python
from functools import wraps
import jwt

class SecureMcpServer(McpServer):
    def __init__(self):
        super().__init__("secure-server")
        self.jwt_secret = os.getenv("JWT_SECRET")
        self.authorized_clients = set()
    
    def require_auth(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            client_id = self.get_current_client_id()
            if client_id not in self.authorized_clients:
                raise McpError(
                    code=ErrorCode.PERMISSION_DENIED,
                    message="未授权的客户端"
                )
            return await func(*args, **kwargs)
        return wrapper
    
    @require_auth
    async def call_tool(self, name: str, arguments: dict):
        # 安全的工具调用
        return await super().call_tool(name, arguments)
```

#### 2. 数据加密
```python
from cryptography.fernet import Fernet

class EncryptedDataServer(McpServer):
    def __init__(self):
        super().__init__("encrypted-server")
        self.cipher_suite = Fernet(os.getenv("ENCRYPTION_KEY"))
    
    async def read_resource(self, uri: str):
        """读取加密资源"""
        encrypted_data = await self.load_encrypted_data(uri)
        decrypted_data = self.cipher_suite.decrypt(encrypted_data)
        return decrypted_data.decode('utf-8')
```

## 🚀 未来发展趋势

### 技术演进方向

#### 1. 协议增强
```markdown
🔮 未来特性：
- 流式数据传输支持
- 更强的类型系统
- 内置缓存机制
- 事务支持
- 更好的错误恢复
```

#### 2. 生态系统扩展
```markdown
🌍 生态发展：
- 更多预构建服务器
- 可视化配置工具
- 监控和分析平台
- 插件市场
- 企业级管理控制台
```

#### 3. 与AI Agent集成
```python
# 未来的AI Agent集成示例
class IntelligentMcpAgent:
    def __init__(self):
        self.mcp_clients = []
        self.reasoning_engine = ReasoningEngine()
    
    async def process_request(self, user_request: str):
        # 1. 分析用户请求
        intent = await self.reasoning_engine.analyze_intent(user_request)
        
        # 2. 选择合适的MCP服务器
        relevant_servers = self.select_servers(intent)
        
        # 3. 收集上下文信息
        context = await self.gather_context(relevant_servers, intent)
        
        # 4. 生成响应
        response = await self.generate_response(context, user_request)
        
        return response
```

## 📊 性能优化与监控系统

### 高级性能监控

#### 实时性能指标收集
```python
import psutil
import asyncio
from dataclasses import dataclass, asdict
from typing import Dict, List
import time
from collections import deque

@dataclass
class PerformanceMetrics:
    """性能指标数据结构"""
    timestamp: float
    cpu_usage: float
    memory_usage: float
    memory_available: int
    disk_io_read: int
    disk_io_write: int
    network_sent: int
    network_recv: int
    active_connections: int
    response_time: float
    request_count: int
    error_count: int

class PerformanceMonitor:
    """性能监控器"""
    
    def __init__(self, collection_interval: int = 5):
        self.collection_interval = collection_interval
        self.metrics_history: deque = deque(maxlen=1000)  # 保留最近1000条记录
        self.is_monitoring = False
        self.thresholds = {
            'cpu_usage': 80.0,
            'memory_usage': 85.0,
            'response_time': 5.0,
            'error_rate': 0.05
        }
        self.alerts = []
    
    async def start_monitoring(self):
        """启动监控"""
        self.is_monitoring = True
        while self.is_monitoring:
            metrics = await self.collect_metrics()
            self.metrics_history.append(metrics)
            
            # 检查告警阈值
            await self.check_alerts(metrics)
            
            await asyncio.sleep(self.collection_interval)
    
    async def collect_metrics(self) -> PerformanceMetrics:
        """收集性能指标"""
        # 系统资源指标
        cpu_usage = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk_io = psutil.disk_io_counters()
        network_io = psutil.net_io_counters()
        
        # 应用指标
        active_connections = await self.get_active_connections()
        response_time = await self.get_average_response_time()
        request_count = await self.get_request_count()
        error_count = await self.get_error_count()
        
        return PerformanceMetrics(
            timestamp=time.time(),
            cpu_usage=cpu_usage,
            memory_usage=memory.percent,
            memory_available=memory.available,
            disk_io_read=disk_io.read_bytes if disk_io else 0,
            disk_io_write=disk_io.write_bytes if disk_io else 0,
            network_sent=network_io.bytes_sent if network_io else 0,
            network_recv=network_io.bytes_recv if network_io else 0,
            active_connections=active_connections,
            response_time=response_time,
            request_count=request_count,
            error_count=error_count
        )
    
    async def check_alerts(self, metrics: PerformanceMetrics):
        """检查告警条件"""
        alerts = []
        
        if metrics.cpu_usage > self.thresholds['cpu_usage']:
            alerts.append({
                'type': 'CPU_HIGH',
                'message': f'CPU使用率过高: {metrics.cpu_usage:.2f}%',
                'severity': 'WARNING',
                'timestamp': metrics.timestamp
            })
        
        if metrics.memory_usage > self.thresholds['memory_usage']:
            alerts.append({
                'type': 'MEMORY_HIGH',
                'message': f'内存使用率过高: {metrics.memory_usage:.2f}%',
                'severity': 'WARNING',
                'timestamp': metrics.timestamp
            })
        
        if metrics.response_time > self.thresholds['response_time']:
            alerts.append({
                'type': 'RESPONSE_SLOW',
                'message': f'响应时间过长: {metrics.response_time:.2f}s',
                'severity': 'CRITICAL',
                'timestamp': metrics.timestamp
            })
        
        # 计算错误率
        if metrics.request_count > 0:
            error_rate = metrics.error_count / metrics.request_count
            if error_rate > self.thresholds['error_rate']:
                alerts.append({
                    'type': 'ERROR_RATE_HIGH',
                    'message': f'错误率过高: {error_rate:.2%}',
                    'severity': 'CRITICAL',
                    'timestamp': metrics.timestamp
                })
        
        self.alerts.extend(alerts)
        
        # 发送告警通知
        for alert in alerts:
            await self.send_alert_notification(alert)
    
    def get_metrics_summary(self, duration_minutes: int = 60) -> Dict:
        """获取指标摘要"""
        cutoff_time = time.time() - (duration_minutes * 60)
        recent_metrics = [m for m in self.metrics_history if m.timestamp >= cutoff_time]
        
        if not recent_metrics:
            return {}
        
        return {
            'avg_cpu_usage': sum(m.cpu_usage for m in recent_metrics) / len(recent_metrics),
            'avg_memory_usage': sum(m.memory_usage for m in recent_metrics) / len(recent_metrics),
            'avg_response_time': sum(m.response_time for m in recent_metrics) / len(recent_metrics),
            'total_requests': sum(m.request_count for m in recent_metrics),
            'total_errors': sum(m.error_count for m in recent_metrics),
            'error_rate': sum(m.error_count for m in recent_metrics) / max(sum(m.request_count for m in recent_metrics), 1),
            'sample_count': len(recent_metrics)
        }

class MonitoredMcpServer(McpServer):
    """带性能监控的MCP服务器"""
    
    def __init__(self):
        super().__init__("monitored-server")
        self.performance_monitor = PerformanceMonitor()
        self.request_stats = {
            'total_requests': 0,
            'total_errors': 0,
            'response_times': deque(maxlen=1000)
        }
    
    async def start(self):
        """启动服务器"""
        # 启动性能监控
        asyncio.create_task(self.performance_monitor.start_monitoring())
        
        # 启动自动优化
        asyncio.create_task(self.auto_optimization_loop())
        
        await super().start()
    
    async def handle_request(self, method: str, params: dict):
        """处理请求并记录性能指标"""
        start_time = time.time()
        self.request_stats['total_requests'] += 1
        
        try:
            result = await super().handle_request(method, params)
            return result
        except Exception as e:
            self.request_stats['total_errors'] += 1
            raise
        finally:
            end_time = time.time()
            response_time = end_time - start_time
            self.request_stats['response_times'].append(response_time)
    
    def get_performance_report(self) -> Dict:
        """获取性能报告"""
        summary = self.performance_monitor.get_metrics_summary()
        recent_alerts = [a for a in self.performance_monitor.alerts 
                        if a['timestamp'] > time.time() - 3600]  # 最近1小时的告警
        
        return {
            'system_metrics': summary,
            'request_stats': {
                'total_requests': self.request_stats['total_requests'],
                'total_errors': self.request_stats['total_errors'],
                'error_rate': self.request_stats['total_errors'] / max(self.request_stats['total_requests'], 1),
                'avg_response_time': sum(self.request_stats['response_times']) / max(len(self.request_stats['response_times']), 1)
            },
            'recent_alerts': recent_alerts,
            'optimization_recommendations': self.get_optimization_recommendations()
        }
    
    def get_optimization_recommendations(self) -> List[str]:
        """获取优化建议"""
        recommendations = []
        summary = self.performance_monitor.get_metrics_summary()
        
        if summary.get('avg_memory_usage', 0) > 80:
            recommendations.append("考虑增加内存或优化内存使用")
        
        if summary.get('avg_cpu_usage', 0) > 80:
            recommendations.append("考虑增加CPU核心数或优化CPU密集型操作")
        
        if summary.get('avg_response_time', 0) > 3.0:
            recommendations.append("考虑启用缓存或优化数据库查询")
        
        if summary.get('error_rate', 0) > 0.05:
            recommendations.append("检查错误日志并修复高频错误")
        
        return recommendations
```

### 缓存优化策略

#### 多级缓存系统
```python
import redis
import pickle
from typing import Any, Optional, Union
from abc import ABC, abstractmethod

class CacheBackend(ABC):
    """缓存后端抽象基类"""
    
    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        pass
    
    @abstractmethod
    async def set(self, key: str, value: Any, ttl: int = None):
        pass
    
    @abstractmethod
    async def delete(self, key: str):
        pass
    
    @abstractmethod
    async def exists(self, key: str) -> bool:
        pass

class MemoryCache(CacheBackend):
    """内存缓存"""
    
    def __init__(self, max_size: int = 1000):
        self.cache = {}
        self.max_size = max_size
        self.access_times = {}
    
    async def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            self.access_times[key] = time.time()
            return self.cache[key]
        return None
    
    async def set(self, key: str, value: Any, ttl: int = None):
        if len(self.cache) >= self.max_size:
            # LRU淘汰
            oldest_key = min(self.access_times.keys(), 
                           key=lambda k: self.access_times[k])
            await self.delete(oldest_key)
        
        self.cache[key] = value
        self.access_times[key] = time.time()
        
        if ttl:
            # 设置过期时间
            asyncio.create_task(self._expire_key(key, ttl))
    
    async def _expire_key(self, key: str, ttl: int):
        await asyncio.sleep(ttl)
        await self.delete(key)
    
    async def delete(self, key: str):
        self.cache.pop(key, None)
        self.access_times.pop(key, None)
    
    async def exists(self, key: str) -> bool:
        return key in self.cache

class RedisCache(CacheBackend):
    """Redis缓存"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis = redis.from_url(redis_url, decode_responses=False)
    
    async def get(self, key: str) -> Optional[Any]:
        data = await self.redis.get(key)
        if data:
            return pickle.loads(data)
        return None
    
    async def set(self, key: str, value: Any, ttl: int = None):
        data = pickle.dumps(value)
        if ttl:
            await self.redis.setex(key, ttl, data)
        else:
            await self.redis.set(key, data)
    
    async def delete(self, key: str):
        await self.redis.delete(key)
    
    async def exists(self, key: str) -> bool:
        return await self.redis.exists(key)

class MultiLevelCache:
    """多级缓存系统"""
    
    def __init__(self):
        self.levels = [
            MemoryCache(max_size=100),  # L1: 内存缓存
            RedisCache(),               # L2: Redis缓存
        ]
    
    async def get(self, key: str) -> Optional[Any]:
        """从缓存获取数据，按级别查找"""
        for i, cache in enumerate(self.levels):
            value = await cache.get(key)
            if value is not None:
                # 回填到更高级别的缓存
                for j in range(i):
                    await self.levels[j].set(key, value)
                return value
        return None
    
    async def set(self, key: str, value: Any, ttl: int = None):
        """设置缓存到所有级别"""
        for cache in self.levels:
            await cache.set(key, value, ttl)
    
    async def delete(self, key: str):
        """从所有级别删除缓存"""
        for cache in self.levels:
            await cache.delete(key)

class CachedMcpServer(McpServer):
    """带缓存的MCP服务器"""
    
    def __init__(self):
        super().__init__("cached-server")
        self.cache = MultiLevelCache()
        self.cache_stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0
        }
    
    async def read_resource(self, uri: str) -> str:
        """带缓存的资源读取"""
        cache_key = f"resource:{uri}"
        
        # 尝试从缓存获取
        cached_data = await self.cache.get(cache_key)
        if cached_data is not None:
            self.cache_stats['hits'] += 1
            return cached_data
        
        # 缓存未命中，从源读取
        self.cache_stats['misses'] += 1
        data = await super().read_resource(uri)
        
        # 存入缓存
        await self.cache.set(cache_key, data, ttl=3600)  # 1小时过期
        self.cache_stats['sets'] += 1
        
        return data
    
    def get_cache_stats(self) -> Dict:
        """获取缓存统计"""
        total_requests = self.cache_stats['hits'] + self.cache_stats['misses']
        hit_rate = self.cache_stats['hits'] / max(total_requests, 1)
        
        return {
            'hit_rate': hit_rate,
            'total_hits': self.cache_stats['hits'],
            'total_misses': self.cache_stats['misses'],
            'total_sets': self.cache_stats['sets'],
            'total_deletes': self.cache_stats['deletes']
        }
```

### 性能调优

#### 1. 连接池管理
```python
import asyncio
from contextlib import asynccontextmanager

class PooledMcpServer(McpServer):
    def __init__(self):
        super().__init__("pooled-server")
        self.connection_pool = asyncio.Queue(maxsize=10)
        self.metrics = {
            'active_connections': 0,
            'total_requests': 0,
            'error_count': 0
        }
    
    @asynccontextmanager
    async def get_connection(self):
        """获取连接的上下文管理器"""
        try:
            self.metrics['active_connections'] += 1
            connection = await self.connection_pool.get()
            yield connection
        finally:
            await self.connection_pool.put(connection)
            self.metrics['active_connections'] -= 1
```

#### 2. 请求限流
```python
import time
from collections import defaultdict

class RateLimitedServer(McpServer):
    def __init__(self):
        super().__init__("rate-limited-server")
        self.request_counts = defaultdict(list)
        self.rate_limit = 100  # 每分钟100个请求
    
    async def check_rate_limit(self, client_id: str):
        """检查请求频率限制"""
        now = time.time()
        minute_ago = now - 60
        
        # 清理过期记录
        self.request_counts[client_id] = [
            timestamp for timestamp in self.request_counts[client_id]
            if timestamp > minute_ago
        ]
        
        # 检查是否超过限制
        if len(self.request_counts[client_id]) >= self.rate_limit:
            raise McpError(
                code=ErrorCode.RATE_LIMITED,
                message="请求频率过高，请稍后重试"
            )
        
        self.request_counts[client_id].append(now)
```

### 监控体系

#### 1. 指标收集
```python
import time
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class RequestMetrics:
    method: str
    duration: float
    success: bool
    client_id: str
    timestamp: float

class MonitoredMcpServer(McpServer):
    def __init__(self):
        super().__init__("monitored-server")
        self.metrics: List[RequestMetrics] = []
        self.health_status = "healthy"
    
    async def handle_request(self, method: str, params: Dict[str, Any]):
        """处理请求并收集指标"""
        start_time = time.time()
        client_id = self.get_current_client_id()
        success = True
        
        try:
            result = await super().handle_request(method, params)
            return result
        except Exception as e:
            success = False
            raise
        finally:
            duration = time.time() - start_time
            self.metrics.append(RequestMetrics(
                method=method,
                duration=duration,
                success=success,
                client_id=client_id,
                timestamp=start_time
            ))
    
    async def get_health_status(self):
        """健康检查端点"""
        recent_errors = [
            m for m in self.metrics[-100:]  # 最近100个请求
            if not m.success
        ]
        
        error_rate = len(recent_errors) / min(100, len(self.metrics))
        
        if error_rate > 0.1:  # 错误率超过10%
            self.health_status = "unhealthy"
        else:
            self.health_status = "healthy"
        
        return {
            "status": self.health_status,
            "error_rate": error_rate,
            "total_requests": len(self.metrics),
            "uptime": time.time() - self.start_time
        }
```

## 📚 学习资源与社区

### 官方资源
- **[MCP官方文档](https://modelcontextprotocol.io)** - 完整的协议规范和开发指南
- **[Anthropic官方博客](https://www.anthropic.com/news/model-context-protocol)** - MCP发布公告和技术解读
- **[GitHub仓库](https://github.com/modelcontextprotocol)** - 官方SDK和示例代码
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - 调试和测试工具

### 开发工具
- **Python SDK**: `pip install mcp`
- **TypeScript SDK**: `npm install @modelcontextprotocol/sdk`
- **调试工具**: `npm install -g @modelcontextprotocol/inspector`

### 社区项目
```markdown
🔧 实用工具：
- MCP服务器模板库
- 可视化配置工具
- 性能监控仪表板
- 自动化测试框架

🌟 开源服务器：
- 文件系统服务器
- 数据库连接器
- GitHub集成
- Slack集成
- Google Drive连接器
```

---

## 📝 总结

MCP（Model Context Protocol）作为AI领域的重要技术创新，为构建智能、互联的AI系统提供了标准化的解决方案。通过本文的深入解析，我们了解了：

### 🎯 核心价值
1. **标准化**: 统一AI模型与数据源的连接方式
2. **可扩展**: 支持灵活的服务器组合和扩展
3. **安全性**: 内置权限控制和数据保护机制
4. **开放性**: 开源协议，促进生态发展

### 🏗️ 技术特点
- 简洁的客户端-服务器架构
- 强大的Resources、Tools、Prompts三大核心概念
- 灵活的传输协议支持
- 完善的错误处理机制

### 🚀 发展前景
MCP将成为AI应用开发的重要基础设施，推动AI工具的标准化和生态化发展。随着更多工具和平台的支持，MCP生态系统将越来越丰富，为开发者和企业提供更强大的AI应用构建能力。

**开始你的MCP之旅**：从简单的文件系统服务器开始，逐步探索更复杂的应用场景，加入这个激动人心的技术生态！

---

*参考资料：*
- *[Anthropic官方MCP介绍](https://www.anthropic.com/news/model-context-protocol)*
- *[MCP官方文档](https://modelcontextprotocol.io)*
- *[MCP GitHub仓库](https://github.com/modelcontextprotocol)*

> 💡 **提示**：MCP技术还在快速发展中，建议关注官方更新，及时学习新特性和最佳实践！

