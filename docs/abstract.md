### **简介** ###

paozhu是一款C++ Web开发框架，内置HTTP/1 HTTP/2 ORM,可以轻松优雅写Web程序，打破以往C++写Web程序不方便问题。

paozhu编写了Web开发底层设施，比如多域名绑定、SSL证书管理、Cookie、Session、HTML表单管理 、URL处理、文件上传下载、HttpClient客户端、数据库连接ORM、WebSocket、日志，涵盖Web开发基础。

框架基于C++20为基础，一个是使用新标准，编译器支持完整，一个是让代码更加现代化，框架开启了ASAN和所有错误提示，方便开发阶段发现问题，也可以运行时候结合coredumpctl工具，查看各个线程内存栈。配合智能指针基本杜绝内存泄露和越界问题，框架目前基本没有碰到内存泄露或崩溃情况。

paozhu使用C++，主要是考虑接入大模型（CUDA、文件存储、网络、内存操作）、对比下GO JAVA RUST，都不是很完美，C++也不完美，RUST语法不好看、GO简单但是到模型等没有很深厚文化。目前经验是ASAN和coredumpctl两个工具也能保证C++质量，新编译器也能提示一部分。

### paozhu特色 ###

1. 支持HTTP2。
1. 内置ORM（自研MySQL协议），支持协程模式。
1. 多域名管理、SAAS模式支持。
1. IO线程和业务线程分开。
1. 内置微型对象，JSON导入导出，类似脚本语言中变量。
1. 内置FastCGI 支持PHP

### paozhu需求环境 ###

paozhu支持`MacOS`、`Linux`、`Windows`系统。

依赖第三方开发包

`OpenSSL` `Zlib` `Brotli` `ASIO`

可选第三方包  

`GD` `qrencode`


框架基于C++20以上，确保你的系统支持的编译器支持C++20。

- `MacOS` 必须`MacOS 11 BigSur`以上，最好是 `MacOS 14 Sonoma`  
- `Ubuntu` 必须是22.04以上  
- `RockyLinux` `AlmaLinux` 必须是9.1以上  
- `Windows` 必须是Win10 编译器最好19.25以上。

  
### paozhu安装 ###

- MacOS安装 参考 
- Ubuntu安装 参考 
- RockyLinux AlmaLinux 安装 参考  
- Windows 安装 参考  

### paozhu配置 ###

paozhu配置文件在`conf/server.conf`

可以先了解几个变量让项目运行起来。


```
[default]
threadmax=1024
threadmin=5
httpport=80
httpsport=443
cothreadnum=8 ;Coroutines run on thread num

http2_enable=1
debug_enable=1
deamon_enable=0
mainhost=www.869869.com
certificate_chain_file=www.869869.com.pem
private_key_file=www.869869.com.key
tmp_dh_file=dh4096.pem
reboot_password=e10adc3949ba59abbe56e057f20f883e ;md5(md5("123456")+"rand_char"+md5("123456"))
reboot_cron =d180h5 ;MDSW+Hhours reboot process M month D day S season (1 4 7 10) W week  
clean_cron  =m5t600 ;5-minute interval clean 600 seconds ago inactive connection
links_restart_process =n9998877ts1te5 ;More than 15000 connections, restart the process from 1:00 am to 5:00 am
session_type=1 ;session save type 0.file 1.memory 2.redis 3.memcache 4.reserve
static_file_compress_cache=1 ;1 enable, Cache static file compress(gzip,br) content to cache directory 
modelspath=/Users/hzq/paozhu/models
serverpath=/Users/hzq/paozhu
viewpath=/Users/hzq/paozhu/view
viewsopath=/Users/hzq/paozhu/module/view

controlpath=/Users/hzq/paozhu/controller
controlsopath=/Users/hzq/paozhu/module/controller

temppath=/Users/hzq/paozhu/temp
logpath=/Users/hzq/paozhu/log
wwwpath=/Users/hzq/paozhu/www/default
pluginspath=/Users/hzq/paozhu/plugins
libspath=/Users/hzq/paozhu/libs
directorylist=1
index=index.html
;usehtmlcache=1
;usehtmlcachetime=3600
staticfile_cache_num=0 ;0 not cache, min 10 begin  
rewrite_404=0   ;1 file 2 action url path
rewrite_404_action=index.html
method_pre=
method_after=
show_visitinfo=0
upload_max_size=16777216
siteid=1
groupid=0
alias_domain=
init_func=
[www.869869.com]
wwwpath=/Users/hzq/paozhu/www/default
http2_enable=1
;rewrite_404=1
;rewrite_404_action=index.html|psy/index.html|exam/index.html
;controlsopath=/Users/hzq/paozhu/docs/controller
static_pre=downloadfileauth|upload
method_pre= ;api/dev/hostcors
method_after=
isuse_php=0
rewrite_php=/Users/hzq/www/mpdftest|index.php
fastcgi_host=127.0.0.1 ;/run/php/php8.1-fpm.sock
fastcgi_port=9000
upload_max_size=16777216
siteid=1
groupid=0
alias_domain=
init_func=
```

```
threadmax=1024  最大业务线程数
threadmin=5		最小业务线程数
httpport=80	    服务器倾听端口 
httpsport=443   ssl服务器倾听端口 
cothreadnum=8 ;Coroutines run on thread num IO协程使用线程池数量
```

`http2_enable=1` 是否启用http2，可以每个域名有自己的设置

ssl证书文件，申请成功后放在conf目录，生产环境需要在`/var/local/etc/paozhu`放一份

```
mainhost=www.869869.com
certificate_chain_file=www.869869.com.pem
private_key_file=www.869869.com.key
```

`reboot_cron` 自动重启进程周期天D 周W 月M 季节S  h时间小时 180天凌晨5点重启进程
`links_restart_process` 如果达到连接数也可以重启n后面连接数，
ts 开始时段 te结束时段，如果这段时间空闲就会重启。


```
reboot_cron =d180h5 ;MDSW+Hhours reboot process M month D day S season (1 4 7 10) W week  
clean_cron  =m5t600 ;5-minute interval clean 600 seconds ago inactive connection
links_restart_process =n9998877ts1te5 ;More than 15000 connections, restart the process from 1:00 am to 5:00 am
```

`directorylist=1` 显示目录，如果请求静态文件是目录名，目录下也没有index.html文件会显示目录列表。
生产环境建议设置为0.

`wwwpath=/Users/hzq/paozhu/www/default` `/Users/hzq/paozhu`建议换成你的当前目录名称,
项目下`www/default`，是静态文件目录，如果是多域名建议创建`www/domain.com`这个设置是为SAAS服务的。


`upload_max_size=16777216` 上传文件大小，默认是16M

下面几个是SAAS设置可以先不管

```
siteid=1
groupid=0
alias_domain=
init_func=
```

初学者只要关注 `httpport` `httpsport` `wwwpath`设置是否正确。


### paozhu入门 ###

#### Hello, World 例子

```C++

//@urlpath(null,plaintext)
asio::awaitable<std::string> techempowerplaintext(std::shared_ptr<httppeer> peer)
{
    peer->type("text/plain; charset=UTF-8");
    peer->set_header("Date", get_gmttime());
    peer->output = "Hello, World!";
    co_return "";
}

```


### 注解原理

所有注解函数必须放在 `controller/src` 目录下

编译时候使用CMake Hook，先编译一个可以使用的注解处理程序，然后执行这个程序处理  `controller/src` 
目录下所有文件，提取`//@urlpath(null,plaintext)`格式的函数，然后创建相应的头文件，然后生成
注解函数，保存映射函数到 `common/autocontrolmethod.hpp` 文件。

是不是很有Java Sprint Boot味道，这样我们可以毕竟优雅写URL和函数映射关系。


### 注解介绍

`//@urlpath(null,plaintext)` 为注解函数，与url映射，比如 http://localhost/plaintext 会访问到`plaintext` 的注解函数。  

null表示访问plaintext之前必须先执行的注解函数，例如：带权限的后台，需要验证是否登录

`//@urlpath(islogin,plaintext)` 这样必须先执行`islogin`的注解，返回`OK`表示成功。

```C++
//@urlpath(null, islogin)
asio::awaitable<std::string> checklogin(std::shared_ptr<httppeer> peer)
{
    httppeer &client = peer->get_peer();

	if(peer->session["userid"].to_int()>0)
	{
		 co_return "ok";
	} 

	client << "You must login";

    co_return "";
}
```

`asio::awaitable<std::string>` 协程注解函数表示里面代码不走业务线程，
如果繁重计算最好使用普通函数，这样走业务线程处理，不会卡IO线程。

`peer->session["userid"]` 表示取得`session`内容，可以在登录成功后保存进去。

`client << "You must login";` 是重载了`<<`运算符,真实内容是保存在`peer->output`。

`co_return "";` 是协程返回结果，请注意和普通函数区别，不知道最好返回空字符串。

下面是普通注册函数,注意返回值，表示走业务线程池，就是一个连接分配一个线程，经典应用。

建议有负载计算最好使用这种普通函数，不然大量计算可能影响并发量，是有可能，如果只是CRUD业务
用那种方式应该问题不大，用协程就不要使用 `std::this_thread::sleep_for(std::chrono::microseconds(1000));`
这种代码。


```C++
//@urlpath(null,hello)
std::string testhello(std::shared_ptr<httppeer> peer)
{
    httppeer &client = peer->get_peer();
    client << " Hello world! 🧨 Paozhu c++ web framework ";

    return "";
}

```

更多代码使用案例请参考 `controller/src` 目录下的例子


### 内置微型对象介绍


```C++
http::obj_val hval;
hval["aaa"]=3344;
hval["bbb"]="1234567890";

std::cout<<"ll:"<<hval["aaa"].to_int()<<std::endl;
std::cout<<"vv:|"<<static_cast<int>(hval["bbb"].get_type())<<"|"<<std::endl;
if(hval["bbb"].is_string())
{
    std::cout<<"str:"<<hval["bbb"].to_string()<<std::endl;
    std::cout<<"str:"<<hval["bbb"].str_view()<<std::endl;
    std::cout<<"str:"<<hval["bbb"].str_view(2,5)<<std::endl;
}

http::obj_val nval;
nval.from_json("{\"bba\":[[[111,222],[333,444],[555,666]],[[777,888],[999,1111],[2222,3333]],[[4444,5555],[6666,7777],[8888,9999]]]}");

std::cout<<"json out:"<<nval.to_json()<<std::endl;

std::string bbb=nval.to_json();
http::obj_val pval;
pval.from_json(bbb);
```

`http::obj_val` 是框架内置一个微型对象，可以导入`from_json`和导出`to_json` `JSON`对象转换。

是不是有脚本语言味道，可以保存数值和字符串，而且可以保存树形结构。

一个`http::obj_val`是16个字节大小，如果是`KV`对象要64大小。

`hval["aaa"]` 就是`KV`对象。

`http::obj_val` 对象内置方法


- `set_array()` 设置为数组 可以使用push(v)
- `set_obj()` 设置为对象KV 可以使用push(k,v)或obj[key]=value方式
- `set_object()` 设置为对象KV 可以使用push(k,v)或obj[key]=value方式
 
#### 判断对象属性

- `is_array()` 是否是数组
- `is_obj()`	是否是对象
- `is_object()` 是否是对象
- `is_string()` 是否是字符串
- `is_number()` 是否数字

#### 典型使用方式和HTML模板使用

```C++
        client.val["list"].set_array();
        obj_val temp;

        for (unsigned int i = 0; i < topicm.record.size(); i++)
        {
            temp["id"]       = topicm.record[i].topicid;
            temp["parentid"] = topicm.record[i].parentid;
            temp["value"]    = topicm.record[i].title;
            client.val["list"].push(temp);
        }
```

#### 在HTML模板中使用

```HTML
<%c for(auto &a:obj["infos"].as_array()){ %>
<tr>
  <td><%c echo<<a["userid"].to_string(); %></td>
  <td><%c echo<<a["nickname"].to_string(); %></td>
  <td><%c echo<<a["name"].to_string(); %></td>
  <td><%c if(a["isopen"].to_int()==1){ %>启用<%c }else{ %>关闭<%c } %></td>
  <td><a href="/superadmin/edituser?userid=<%c echo<<a["userid"].to_string(); %>">编辑</a> | <a href="/superadmin/deleteuser?userid=<%c echo<<a["userid"].to_string(); %>" onclick="return confirm('确定删除？');">删除</a></td>
</tr>
<%c } %>
```


主要应用在复杂对象交换程序，如果不是可以使用C++ 内置对象或STL库方式。


### ORM介绍

paozhu框架内置ORM对象，目前自己分析MySQL协议，方便和ORM整合，而且支持协程模式，这个官方没有支持。


配置文件位置 `conf/orm.conf`

```
[default]
type=main
host=127.0.0.1
port=3306
dbname=hello_world
user=benchmarkdbuser
password=benchmarkdbpass
pretable=
maxpool=5
dbtype=mysql
#ssl=ON

type=second
host=127.0.0.1
port=3306
dbname=hello_world
user=benchmarkdbuser
password=benchmarkdbpass
pretable=
maxpool=20
dbtype=mysql
#ssl=ON
```

### ORM 配置


`type` 为类型 就是主从分离，以后可以开发缓存同步，目前先主从。host `127.0.0.1` 填本地的地址，MySQL必须大于等于8版本，因为MySQL9不支持旧的认证了，
`pretable` 是表前缀，有时候只有一个数据库权限可以一个数据库放多个业务。
`dbtype` 目前支持MySQL。
`ssl` 可以打开，特别是远程连接时候，启用加密连接。本地的不会启用ssl连接。

### ORM 使用入门

框架目前支持数据库到文件方式，这样修改数据库可以重新生成ORM文件。
编译成功后

```
# ./bin/paozhu_cli 

paozhu_cli(1495,0x7ff85ac38fc0) malloc: nano zone abandoned due to inability to reserve vm space.
  model ｜ view | viewtocpp | control   
 Welcome to use cli to manage your MVC files。
(m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
```

输入 m 选择生成ORM模型文件

```

paozhu_cli(1495,0x7ff85ac38fc0) malloc: nano zone abandoned due to inability to reserve vm space.
  model ｜ view | viewtocpp | control   
 Welcome to use cli to manage your MVC files。
(m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:m   
 🍄 current path: /Users/hzq/paozhu
 1 hello_world
 3 paozhu_docs
 5 cppcms
select db index:
```

输入 1 选择 hello_world 数据库生成文件。

```
paozhu_cli(1495,0x7ff85ac38fc0) malloc: nano zone abandoned due to inability to reserve vm space.
  model ｜ view | viewtocpp | control   
 Welcome to use cli to manage your MVC files。
(m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:m
 🍄 current path: /Users/hzq/paozhu
 1 hello_world
 3 paozhu_docs
 5 cppcms
select db index:1
show tables;
create fortune table to models 🚗
 create table metainfo file: /Users/hzq/paozhu/orm/include/fortunebase.h
create world table to models 🚗
 create table metainfo file: /Users/hzq/paozhu/orm/include/worldbase.h
(m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:x
```

输入 x 退出

```
可以看到 /Users/hzq/paozhu/orm 目录下生成文件
orm
├── include
│   ├── fortune_mysql.h
│   ├── fortunebase.h
│   ├── world_mysql.h
│   └── worldbase.h
├── orm.h
│
models
├── Fortune.cpp
├── World.cpp
└── include
    ├── Fortune.h
    └── World.h
```

ORM目录是实体文件，两个文件一个是mysql连接层mysql结尾，一个是数据表实体映射base.h结尾。
我们其实是操作models目录下ORM文件，这两个文件一个cpp一个h文件，自动生成，
但是只生成一次，有了不会覆盖，因为真正业务系统可以自己加业务代码在里面。

比如
auto myworld = orm::World();
就是 models 目录下 World.h
这个是默认数据库，比如自带cms演示
auto users = orm::cms::Sysuser();

orm是命名空间，主要是给ORM用
cms是orm.conf数据库配置标签，也是生成的cms命名空间，方便隔离和转换数据库，如果是[default]可以省略defaut.

### ORM设计原理

为什么这样设计呢，其实也是paozhu框架目前比其它框架非常有特色的设计。
1. 一个数据库可以有多个连接，这样我们不知道使用那个连接。
1. 数据库名字可能很长，像云主机可能自动生成一个几十个字符长的数据库名，甚至有下划线的。
1. 可以个性标签，这样数据库是什么名不重要了。
1. 我们用来做命名空间隔离表对象，这样很多数据库生成的C++类不会冲突。

所以`orm::cms::Sysuser();`使用cms隔离了`sysuser`表实体C++类，不会与其它数据库同名表有冲突。
比如`orm::erp::Sysuser();` erp是erp数据库标签，他的数据库是什么名不重要，
就是同样有`sysuser`表也没有关系。

之所以这样设计，就是一个业务系统，一个单体服务器程序，可以有很多数据库，而且他们表名可以有重名。
以后可以有不同数据库，比如MySQL PG等，他们可以分布在其它机器上。
他们可以混合集群，单体服务器程序也可以集群，因为内置了读写分离，写服务器可以同一个，
查询可以固定或动态分配数据库服务器,框架可以适合大业务系统。
目前看一个服务器集成数据库和业务程序为主。


### ORM使用例子


表模型有两个成员变量很重要

- data     是单个表数据结构映射
- record   一个std::vector数组

表数据结构

```C++
struct meta{
 unsigned  int  id = 0; 
 int  randomnumber = 0;  
} data;

std::vector<worldbase::meta> record;
```

#### 协程方式使用ORM

```C++
//@urlpath(null,queries)
asio::awaitable<std::string> techempowerqueries(std::shared_ptr<httppeer> peer)
{
    peer->type("application/json; charset=UTF-8");
    peer->set_header("Date", get_gmttime());

    unsigned int get_num = peer->get["queries"].to_int();
    if (get_num == 0)
    {
        get_num = 1;
    }
    else if (get_num > 500)
    {
        get_num = 500;
    }
    auto myworld = orm::World();
    myworld.record.reserve(get_num);
    myworld.lock_conn();
    for (unsigned int i = 0; i < get_num; i++)
    {
        myworld.wheresql.clear();
        unsigned int rd_num = rand_range(1, 10000);
        myworld.where("id", rd_num);
        co_await myworld.async_fetch_append();
    }
    myworld.unlock_conn();
    peer->output = myworld.to_json();
    co_return "";
}
```

- `orm::World();` 是ORM的表模型，默认连接，所以不用defaul
- `myworld.lock_conn();` 就是固定一个连接，因为使用ORM连接池方式,会轮训使用连接。
- `myworld.record.reserve(get_num);` 扩容这个熟悉STL的知道。
- `myworld.wheresql.clear();` 推荐使`myworld.clearWhere();`方式清除条件。
- `myworld.where("id", rd_num);` 加一个条件。
- `co_await myworld.async_fetch_append();` 是高级用法，会附加数据到record对象上。一般使用`co_await myworld.async_fetch();` 会清除record对象，然后重新赋值。


`peer->output = myworld.to_json();` 直接输出JSON到浏览器。



#### 同步使用ORM

正常业务代码在一个线程中运行，就是一个连接一个线程，这个很经典方式。

```C++
//@urlpath(admin_islogin,admin/addtopic)
std::string admin_addtopic(std::shared_ptr<httppeer> peer)
{
    httppeer &client = peer->get_peer();
    try
    {
        auto topicm = orm::cms::Topic();
        topicm.where("userid", client.session["userid"].to_int()).asc("parentid").fetch();

        client.val["list"].set_array();
        obj_val temp;

        for (unsigned int i = 0; i < topicm.record.size(); i++)
        {
            temp["id"]       = topicm.record[i].topicid;
            temp["parentid"] = topicm.record[i].parentid;
            temp["value"]    = topicm.record[i].title;
            client.val["list"].push(temp);
        }
    }
    catch (std::exception &e)
    {
        client.val["code"] = 1;
    }

    peer->view("admin/addtopic");
    return "";
}
```

`httppeer &client = peer->get_peer();` 引用连接对象

`auto topicm = orm::cms::Topic();`  产生一个ORM模型，这个模型源文件在models目录下面,Topic就是数据库表名，如果设置前缀那么框架会自动去除，`topicm.where` 添加查询条件，`asc("parentid").fetch()` 按升序`parentid`查询，`.fetch()`发出查询命令。

#### 分页使用

如果不想要那么多数据可以分页取出，特别是网络业务，需要占用带宽或cpu资源，平时最好按需使用`.select("fieldname1,fieldname2")` 取出字段数据，使用`.limit(pos,offset)`限定范围。

使用`.page(page, 10, 5)`已经自动添加了`.limit(pos,offset)`限定范围，只要传入`page`页码。


```C++
auto [bar_min, bar_max, current_page, total_page] = artmodel.page(page, 10, 5);

client.val["pageinfo"].set_object();
client.val["pageinfo"]["min"]     = bar_min;
client.val["pageinfo"]["max"]     = bar_max;
client.val["pageinfo"]["current"] = current_page;
client.val["pageinfo"]["total"]   = total_page;
```

`.page(page, 10, 5)` 返回四个数值，`bar_min` `bar_max`由传入5决定范围，
就是前后2页窗口，每页10个，


### C++生产环境故障排查

框架会隔1分钟左右检查 `log` 目录是否有`restart_server`文件

如果我们需要取现在线程栈样品，可以 `touch log/restart_server` 这样可以让进程重启

可以使用`pstree -aup` 查看进程情况

如果已经取样，我命需要分析进程栈情况

需要安装gdb coredumpctl

核心coredump查看

```
coredumpctl list
coredumpctl info
```

直接在线看,1524是 info 显示的进程号，也就是之前`pstree -aup` 看的

```
coredumpctl gdb 1524
```

bt可以查看

进去后我们可以保存出来看，保存在当前目前 `thread_info.txt`文件。

```
set logging file thread_info.txt
set logging enabled on
thread apply all bt
set logging enabled off
```


核心coredump一般在

```
/var/lib/systemd/coredump
```

如果编译使用-g 那么会看到类似下面样子，一般会显示各种线程目前正在干什么事

```
Thread 17 (Thread 0x7fd9f16b9640 (LWP 10658)):
          #0  http::hash_objkey (key=&quot;data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2My&quot;...) at /www/paozhu/vendor/httpserver/src/request.cpp:54
          #1  0x000000000060032f in http::OBJ_VALUE::operator[] (this=0x7fd9cc01e520, key=&quot;data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2MyU2RiUyRiU3MCUzOSU3OSU3MSU2RSU2NCUyRCU2QyU3MiU2QiU2NCU2NyU1RiU&quot;...) at /www/paozhu/vendor/httpserver/src/request.cpp:315
          #2  0x00000000005a990c in http::httpparse::procssxformurlencoded (this=0x7fd9b400d370) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:389
          #3  0x00000000005b1bfa in http::httpparse::process (this=0x7fd9b400d370, buffer=0x2e223c0 &quot;POST /public/static/lib/webuploader/0.1.5/server/preview.php HTTP/1.1\r\nHost: www. paozhu.org\r\nUser-Agent: Mozilla/5.0 AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0\r\nAccept-Encoding: gzip, deflate&quot;..., buffersize=964) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:2823
          
```