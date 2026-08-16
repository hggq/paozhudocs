### **Abstract** ###

Paozhu is a C++ Web development framework with built-in HTTP/1/HTTP/2 ORM, making it easy and elegant to write web programs, breaking the previous inconvenience of writing web programs in C++.

Paozhu has developed the underlying infrastructure for web development, such as multi domain binding, SSL certificate management, cookies, sessions, HTML form management, URL processing, file upload and download, HttpClient, ORM, WebSocket, Logs, covering the basics of web development.

The framework is based on C++20, using new standards with complete compiler support, and modernizing the code. The framework has enabled ASAN and all error prompts(-Wall), making it easy to identify problems during the development phase. It can also be combined with the coredumpctl tool at runtime to view the memory stacks of various programs. Combined with intelligent pointers, the framework has basically eliminated memory leaks and out of bounds issues, and has not encountered any memory leaks or crashes so far.


Paozhu uses C++ mainly to consider the integration of large models (CUDA, file storage, network, memory operations), compared to GO JAVA RUST, which are not very perfect. C++ is also not perfect, RUST syntax is not good-looking, GO is simple but lacks AI culture in Big models, etc. At present, the experience is that ASAN and coredumpctl tools can also ensure the quality of C++, and the new compiler can also provide some hints.


### paozhu Feature ###

1. Supports HTTP2.
1. Built in ORM (self-developed MySQL protocol), supporting coroutine mode.
1. Multi domain management and SAAS mode support.
1. Separate IO threads from business threads.
1. Built in micro objects, JSON import and export, similar to variables in scripting languages.
1. Built in FastCGI supports PHP

### paozhu Framework technology architecture principle ###

The Paozhu framework uses ASIO's thread pool, which is specifically designed for IO usage, such as network sending and receiving. The framework also has a built-in business thread pool, which is dedicated to running business code.


At present, the frameworks mainly use HTTP and HTTPS, with two threads constantly listening for connections to arrive. When a user accesses using a browser or client, a connection is generated, and after handshake, the server waits for the client to send HTTP header information. Then, the server processes the HTTP protocol. If the URL matches, it registers a function and checks whether the function is a coroutine or a regular function. The coroutine runs directly. If it is a regular function, it is thrown directly into the business thread pool. If the URL is a static file, it is sent directly without going through the business thread.


Because C++coroutines are contagious, when running business code in coroutine registration functions, you need to use ORM coroutine methods. If you cannot initiate coroutine functions in regular functions, you can only use ORM regular functions.

It is generally recommended to use one connection to one thread, and business threads also have queues, so business code should not use the sleep function to sleep casually.


### paozhu Environment ###

Paozhu supports `MacOS` `Linux` and `Windows` systems.

Uses third-party dependencies  

`OpenSSL` `Zlib` `Brotli` `ASIO`

Optional third-party dependencies

`GD` `qrencode`


The framework is based on C++20 or above, ensuring that your system supports compilers that support C++20.

- `MacOS` `MacOS 11 BigSur` above,suggestion `MacOS 14 Sonoma`  
- `Ubuntu` 22.04 above  
- `RockyLinux` `AlmaLinux` 9.1 above  
- `Windows` Win10 Compiler 19.25 or above。

  
### paozhu Install ###


- [MacOS install](https://hggq.github.io/paozhudocs/macos_en.html)     
- [Ubuntu install](https://hggq.github.io/paozhudocs/ubuntu_en.html)     
- [RockyLinux AlmaLinux install](https://hggq.github.io/paozhudocs/linux_en.html)    
- [Windows install]    

### paozhu Config ###

paozhu Config file at `conf/server.conf`

You can first understand a few variables to get the project running.


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
threadmax=1024  Maximum number of business threads
threadmin=5		 Minimum number of business threads
httpport=80	    Server listening port
httpsport=443   SSL server listening port
cothreadnum=8 ;Coroutines run on thread num 
```

`http2_enable=1` Whether to enable HTTP/2, each domain can have its own settings

SSL certificate file, after successful application, it should be placed in the conf directory. For production environments, a copy should be placed in `/var/local/etc/paozhu`.

```
mainhost=www.869869.com
certificate_chain_file=www.869869.com.pem
private_key_file=www.869869.com.key
```

`reboot_cron` Automatic restart process cycle day D week W month M season S h time hour 180 days 5 am restart process
`links_restart_process` If the number of connections is reached, you can also restart the number of connections after n, The ts start period and te end period will restart if they are idle during this period.


```
reboot_cron =d180h5 ;MDSW+Hhours reboot process M month D day S season (1 4 7 10) W week  
clean_cron  =m5t600 ;5-minute interval clean 600 seconds ago inactive connection
links_restart_process =n9998877ts1te5 ;More than 15000 connections, restart the process from 1:00 am to 5:00 am
```

`directorylist=1` Display directory. If the requested static file is a directory name and there is no index.html file in the directory, a directory list will be displayed.
It is recommended to set the production environment to 0

`wwwpath=/Users/hzq/paozhu/www/default` `/Users/hzq/paozhu` Suggest changing to your current directory name, Under the project, 'www/default' is a static file directory. If it is a multi domain, it is recommended to create a 'www/domain.com' setting for SAAS services.


`upload_max_size=16777216` Upload file size, default is 16M  

The following are SAAS settings that can be ignored for now  

```
siteid=1
groupid=0
alias_domain=
init_func=
```

Beginners only need to understand `httpport` `httpsport` `wwwpath` `logpath` Ensure that the settings are correct, Replace all '/Users/hzq/paozhu' with your directory.


### paozhu Introduction ###

#### Hello, World Example

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


### Annotation Fundamentals

All annotation functions must be placed in the 'controller/src' directory

When compiling, use the CMake Hook to first compile an annotation handler that can be used, and then execute this program to handle `controller/src` Extract functions in the format of '//@ urlpath(null, plaintext)' from all files in the directory, create corresponding header files, and then generate Annotate the function and save the mapping function to the 'common/autocontrolmethod.hpp' file.

Doesn't it have a strong Java Sprint Boot flavor, so that we can elegantly write URL and function mapping relationships after all.


### Annotation Example

`//@urlpath(null,plaintext)` annotate functions，Mapping with URL，Example http://localhost/plaintext Will access the annotation function of 'plaintext'.  

null represents the annotation function that must be executed before accessing plaintext, for example: a backend with permissions that requires verification of login status

`//@urlpath(islogin,plaintext)` This requires first executing the 'islogin' annotation and returning 'OK' to indicate success.

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

`asio::awaitable<std::string>` The coroutine annotation function indicates that the code inside does not go through business threads, If heavy calculations are required, it is best to use regular functions so that business threads can handle them without blocking IO threads.

`peer->session["userid"]` get `session` content, The content saved after successful login before。

`client << "You must login";` It is overloaded with the<<operator, and the actual content is saved in peer->output.

`co_return "";` It is a coroutine that returns the result. Please note that it is different from a regular function, and it is best to return an empty string if you are unsure.

The following is a regular registration function, pay attention to the return value, indicating that it goes through the business thread pool, which assigns one thread to each connection. This is a classic application.

It is recommended to use this ordinary function for load computing, otherwise a large amount of computation may affect concurrency, which is possible if it is only for CRUD business
It shouldn't be a problem to use that method. When using coroutines, don't use std:: this_thread::sleep_for(std::chrono::microseconds(1000));`
This type of code.


```C++
//@urlpath(null,hello)
std::string testhello(std::shared_ptr<httppeer> peer)
{
    httppeer &client = peer->get_peer();
    client << " Hello world! 🧨 Paozhu c++ web framework ";

    return "";
}

```

For more code usage cases, please refer to the examples in the 'controller/src' directory


### Introduction to Built in Micro Objects


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

`http::obj_val` is a built-in micro object in the framework that can be used to import and export from_json and to_json object conversions.

Does it have a scripting language flavor? It can save values and strings, and can also save tree structures.

`http::obj_val` is 16bytes size，one `KV` Object 64bytes size。

`hval["aaa"]` is `KV` Object。

`http::obj_val` Built in methods for objects


- `set_array()` set is array and push(v)
- `set_obj()` set is KV and usempush(k,v) or obj[key]=value  
- `set_object()` set is KV and usempush(k,v) or obj[key]=value  
 
#### More methods

- `is_array()` it is an array or not
- `is_obj()`   it is an object or not
- `is_object()` it is an object or not
- `is_string()` it is an string or not
- `is_number()` it is an number or not

#### Typical usage and HTML template usage

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

#### Using in HTML templates

```HTML
<%c for(auto &a:obj["infos"].as_array()){ %>
<tr>
  <td><%c echo<<a["userid"].to_string(); %></td>
  <td><%c echo<<a["nickname"].to_string(); %></td>
  <td><%c echo<<a["name"].to_string(); %></td>
  <td><%c if(a["isopen"].to_int()==1){ %>Open<%c }else{ %>Close<%c } %></td>
  <td><a href="/superadmin/edituser?userid=<%c echo<<a["userid"].to_string(); %>">Edit</a> | <a href="/superadmin/deleteuser?userid=<%c echo<<a["userid"].to_string(); %>" onclick="return confirm('Are you sure delete？');">Delete</a></td>
</tr>
<%c } %>
```

#### Micro Objects advanced methods

- `obj_val multi_sort(std::string_view key,unsigned char order);` 2D array key name sorting, order is SORT_ASC or SORT_DESC.
- `obj_val multi_sort(std::string_view key,unsigned char order,std::string_view key2,unsigned char order2);`	2D array key name sorting, order is SORT_ASC or SORT_DESC, If there is the same secondary sorting,need key2 and order2.

#### Micro Objects advanced methods example

```c++
    http::obj_val zval4;
    zval4.set_array();
    float s[6]={83.3,77.75,60.45,83.3,77.75,45.6};
    for(unsigned int jjj=0;jjj<6;jjj++)
    {
        http::obj_val z4;
        z4.set_object();
        z4["name"]="sss"+std::to_string(jjj);
        z4["score"]=s[jjj];
        z4["id"]=jjj+10;
        zval4.push(z4);
    }
    http::obj_val zval5=zval4.multi_sort("score",SORT_ASC);

    std::cout<<"------"<<std::endl;
    if(zval5.is_array())
    {
        std::cout<<"multi_sort score result: "<<zval5.size()<<std::endl;
        for(auto &a:zval5.as_array())
        {
            if(a.is_object())
            {
                for(auto &[aa,bb]:a.as_object())
                {
                    std::cout<<"zval5["<<aa<<"]="<< bb.to_string()<<std::endl;
                }
            }
            std::cout<<std::endl;
        }
    }

    http::obj_val zval6=zval4.multi_sort("score",SORT_ASC,"id",SORT_DESC);
    std::cout<<"------"<<std::endl;
    if(zval6.is_array())
    {
        std::cout<<"multi_sort score id result: "<<zval6.size()<<std::endl;
        for(auto &a:zval6.as_array())
        {
            if(a.is_object())
            {
                for(auto &[aa,bb]:a.as_object())
                {
                    std::cout<<"zval6["<<aa<<"]="<< bb.to_string()<<std::endl;
                }
            }
            std::cout<<std::endl;
        }
    }
    std::cout<<"------"<<std::endl;
```


Mainly used in complex object swapping programs, if it is not possible to use C++built-in objects or STL library methods.


### ORM Introduction

The data imported in the installation environment section.

The paozhu framework has built-in ORM objects and currently analyzes the MySQL protocol to facilitate integration with ORM. It also supports coroutine mode, which is not officially supported by MySQL.


Config file at `conf/orm.conf`

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

### ORM Config


`type` The type is master-slave separation, and cache synchronization can be developed in the future. Currently, master-slave is preferred. Host '127.0.0.1' fills in the local address, MySQL must be greater than or equal to version 8 because MySQL 9 does not support old authentication，

`pretable` It is a table prefix, sometimes only one database permission can store multiple businesses in one database.

`dbtype` Currently supports MySQL.

`SSL` can be opened, especially when connecting remotely, enabling encrypted connections. Local SSL connections will not be enabled.

### ORM Usage

The framework currently supports database to create cpp file conversion, so modifying the database can regenerate ORM files.

After successful compilation

```
# ./bin/paozhu_cli 

paozhu_cli(1495,0x7ff85ac38fc0) malloc: nano zone abandoned due to inability to reserve vm space.
  model ｜ view | viewtocpp | control   
 Welcome to use cli to manage your MVC files。
(m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
```

Enter m to select and generate ORM model file

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

Enter 1 to select the hello-world database to generate the file.

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

Enter x to exit


You can see the generated files in the/Users/hzq/paozhu/orm directory.


```
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

The ORM directory is an entity file, consisting of two files: one is a MySQL connection layer file with a name ending in mysql.h, and the other is a data table entity mapping file with a name ending in base.h.

We are actually manipulating ORM files in the models directory, one cpp and one h file, which are automatically generated,
But it is only generated once and will not be overwritten, because the real business system can add its own business code inside.

For example

auto myworld = orm::World();
models directory  World.h

This is the default database, such as the built-in CMS demo
auto users = orm::cms::Sysuser();

orm is namespae, Mainly used for ORM business
CMS is the orm.conf file database configuration tag and also the generated CMS namespace, which facilitates database isolation and transformation. If it is [default], defaut can be omitted

### ORM design philosophy

Why is it designed in this way? Actually, it is also a unique design of the Paozhu framework compared to other frameworks.

1. A database can have multiple connections, so we don't have to know which connection to use.
1. The database name may be very long, for example, a cloud host may automatically generate a database name that is tens of characters long, even with underscores.
1. Personalized tags can be used, so that the name of the database is not important anymore.
1. We use it to create namespace isolation table objects, so that many C++classes generated by databases do not conflict.
1. ORM designs powerful and elegant chain writing, while Go and Rust have design flaws that prevent the use of chain writing.


So `orm::cms::Sysuser();` Using CMS to isolate the 'sysuser' table entity C++ class will not conflict with tables with the same name in other databases.
For example, `orm::erp::Sysuser();`  ERP is an ERP database tag, and the name of its database is not important,
It doesn't matter if there is also a `sysuser` table.

The reason for this design is that it is a business system, a single server program that can have many databases, and their table names can have duplicate names.
In the future, there can be different databases, such as MySQL PG, which can be distributed on other machines.
They can mix clusters, and individual server programs can also be clustered, because they have built-in read-write separation, and the write servers can be the same,
Querying can allocate database servers in a fixed or dynamic manner, and the framework can be suitable for large business systems.
Currently, the focus is on integrating a server with a database and business programs.


### ORM usage example


The table model has two important member variables

- data     is a mapping of a single table data structure
- record   is a std::vector array

Table Data Structure

```C++
struct meta{
 unsigned  int  id = 0; 
 int  randomnumber = 0;  
} data;

std::vector<worldbase::meta> record;
```

#### ORM use for Coroutine

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

- `orm::World();` It is an ORM table model with default connections, so there is no need for default
- `myworld.lock_conn();` It's about fixing a connection, because using ORM connection pool method will rotate the use of connections.
- `myworld.record.reserve(get_num);` The std::vector reserve。
- `myworld.wheresql.clear();` Recommend using `myworld.clearWhere()` Method to clear conditions。
- `myworld.where("id", rd_num);` Add where。
- `co_await myworld.async_fetch_append();` It is an advanced usage that will attach data to the record object. Generally, `co_await myworld.async_fetch();` is used` It will clear the record object and then reassign it.


`peer->output = myworld.to_json();` Directly output JSON to the browser.



#### Synchronize the use of ORM

Normal business code runs in a thread, one thread by one connect at a time, which is a classic way.

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

`httppeer &client = peer->get_peer();` Reference connection object

`auto topicm = orm::cms::Topic();`  Create an ORM model object, with the model source file located in the models directory,Topic is the database table name，If a prefix is set, the framework will automatically remove it,`topicm.where` add sql where，`asc("parentid").fetch()` order `parentid` asc query ，`.fetch()` send query command。

#### Page usage

If you don't want so much data to be paginated and retrieved, especially for network services that require bandwidth or CPU resources，It is best to use it as needed `.select("fieldname1,fieldname2")` Retrieve field data, use `.limit(pos,offset)` for range.

Use `.page(page, 10, 5)` It has been automatically added `.limit(pos,offset)` to sql string,now only input `page` number.


```C++
auto [bar_min, bar_max, current_page, total_page] = artmodel.page(page, 10, 5);

client.val["pageinfo"].set_object();
client.val["pageinfo"]["min"]     = bar_min;
client.val["pageinfo"]["max"]     = bar_max;
client.val["pageinfo"]["current"] = current_page;
client.val["pageinfo"]["total"]   = total_page;
```

`.page(page, 10, 5)` Return four numerical values,`bar_min` `bar_max` The range is determined by the input of 5, It consists of two pages of windows, with 10 per page,

ORM where Other Methods

`whereLike(fieldname,searchword)` it's just " and fieldname '%searchword%'" alias
﻿
`whereAnd` it's just " and fieldname = val " alias  
`whereIn` it's just " and fieldname IN(val) " alias 

### Paozhu Framework View Beginner's Guide

paozhu 做为 c++ web framework 框架 就是MVC 模式，现在就是说v 这个视图功能


#### 1、视图说明

就是给浏览器显示的内容，其实就是html内容，脚本语言就是操作这个，那我们c++怎么操作呢，也是在html里面放c++ 代码，但是我们是把html代码编译成c++代码。常驻内存，这样速度也很快，几百个视图文件只要几M内存，一个公司项目也就是1000左右页面。估计不到10M内存，如果用脚本语言还要大量io读取文件。 paozhu  c++ web framework 直接编译为程序，不用io读取了，速度极快。

#### 2、创建视图

我们在view目录

创建 login 目录 然后再创建一个login.html文件在login目录里面

view
- login
  - login.html


大概这样子

#### login.html 文件内容


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.101.0">
    <title>Content Management System</title>

    <link href="/assets/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="text-center">
    <%c include_sub("home/header",obj); %>
    <div class="container text-center">
      <div class="row">
        <div class="col-3"></div>  
        <div class="col-6">
          <h2 id="horizontal-form">CMS Admin </h2>
          <form action="/cms/loginpost" method="post">
            <div class="row mb-3">
              <label for="username" class="col-sm-2 col-form-label">Username</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="username" name="username" value="admin">
              </div>
            </div>
            <div class="row mb-3">
              <label for="password" class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input type="password" class="form-control" id="password" name="password" value="123456">
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Sign in</button>
          </form>
      
        </div>
 
      </div>
    </div>

  </body>
  </html>


```

include_sub("home/header",obj); 

说明还包括一个子页面，我们再在view创建一个子页面目录home 

view
- home
  - header.html
- login
  - login.html


大概这样子

#### header.html 内容其实就是网页头部信息


```html

<style>
  ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #333;
  }
  
  li {
      float: left;
      border-right:1px solid #bbb;
  }
  
  li:last-child {
      border-right: none;
  }
  
  li a {
      display: block;
      color: white;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
  }
  
  li a:hover:not(.active) {
      background-color: #111;
  }
  
  .active {
      background-color: #4CAF50;
  }
  </style>
<ul>
  <li><a class="active" href="/">主页</a></li>
  <li><a href="#news">新闻</a></li>
  <li><a href="#contact">联系</a></li>
  <li style="float:right"><a href="#about">关于</a></li>
</ul>

<h3>子页面页面include_sub("home/header")导航测试 |<%c echo<<vinfo.get["aa"].to_string(); %>| </h3>
     
 
```


echo<<vinfo.get["aa"].to_string();

这个就是 视图标签 c++ 代码用<%c包括起来

echo 是缓冲区，就是跟外面html一起拼起来

变成c++代码

是这样子

echo<<"导航测试 |";

echo<<vinfo.get["aa"].to_string();

echo<<"| < /h3 >";


具体可以看viewsrc/view/home/header.cpp代码。


#### 3、 编译视图到cpp文件

在网站根目录下运行

./bin/paozhu_cli

选择f 生成文件

```c++

./bin/paozhu_cli
./bin/paozhu_cli  model ｜ view | viewtocpp | control   
 🎉 Welcome to use cli to manage your MVC files。
(m)model (v)view (f)viewtocpp or (c)control,x or q to exit[input m|v|f|c|]:f
 🍄 current path: /Users/hzq/paozhu
1 [+] view/home/header.html 	 time: 2022-12-12 13:1:41
2 [+] view/login/login.html 	 time: 2022-12-12 13:1:26
 please input number to parse to cpp file.
 a update all , example: 1 3 4 5 enter key, q or x to exit,r reload 
 input number:a

```

我们先用f,直接跟框架一起编译的方法。

然后选择a,所有修改或新建的视图文件都转化为cpp文件

文件保存在 viewsrc目录

viewsrc
- view
  - login
    - login.cpp
  - home
    - header.cpp

- include
  - viewsrc.h
  - regviewmethod.hpp


大概这样

我们两个 login.html header.html已经转为cpp文件

include 目录里面两个文件

viewsrc.h 是所有视图文件函数的定义，以后可能会分开，一个视图文件对一个头文件。

regviewmethod.hpp 是视图注册函数，框架调用这个注册到框架

#### viewsrc.h 文件内容


```c++

#ifndef __HTTP_VIEWSRC_ALL_METHOD_H
#define __HTTP_VIEWSRC_ALL_METHOD_H

#if defined(_MSC_VER) && (_MSC_VER >= 1200)
#pragma once
#endif // defined(_MSC_VER) && (_MSC_VER >= 1200)

#include<string>
#include<map>
#include<functional>
#include "request.h"
#include "viewso_param.h"

namespace http { 
namespace view { 

namespace home{ 

	std::string header(const struct view_param &vinfo,http::OBJ_VALUE &obj);
}

namespace login{ 

	std::string login(const struct view_param &vinfo,http::OBJ_VALUE &obj);
}


}

}
#endif

```

可以看到视图都放在命名空间里面，这样，一个目录里面和其它目录里面视图文件重名也没有冲突。


#### regviewmethod.hpp 注册函数文件


```c++

#ifndef __HTTP_REG_VIEW_METHOD_HPP
#define __HTTP_REG_VIEW_METHOD_HPP

#if defined(_MSC_VER) && (_MSC_VER >= 1200)
#pragma once
#endif // defined(_MSC_VER) && (_MSC_VER >= 1200)

#include<string>
#include<map>
#include<functional>
#include "request.h"
#include "viewso_param.h"
#include "viewmethold_reg.h"
#include "viewsrc.h"

namespace http
{
  void _initview_method_regto(VIEW_REG  &_viewmetholdreg)
  {
            	 //create time: Mon, 12 Dec 2022 05:01:53 GMT

	_viewmetholdreg.emplace("home/header",http::view::home::header);
	_viewmetholdreg.emplace("login/login",http::view::login::login);

	} 
}
#endif

```

两个函数注册到回调函数上，就是一个视图文件是一个函数

目录名和文件名 组成一个注册点

login/login 是一个注册点

控制器 peer->view("login/login"); 调用方法


#### 4、 视图测试

我们创建完视图，现在测试一下


我安照hello world入门那章 

`controller/src`目录 创建 `testview.cpp` 文件


大概这样子

 

#### testview.cpp
 
```c++
#include <chrono>
#include <thread>
#include "httppeer.h"
#include "testview.h"
namespace http
{
	   //@urlpath(null,testview)
      std::string testloginview(std::shared_ptr<httppeer> peer)
      {
            httppeer &client = peer->getpeer();
            client << " 视图测试 ";
            // client << client.gethosturl();
            // client<<"<p><a href=\""<<client.gethosturl()<<"/showcookie\">show</a></p>";

            peer->view("login/login");
            return "";
      }

}

```

把 testview 映射到 testloginview 上，两个名字可以不一样。

就是http://localhost/testview 可以访问我们的testloginview函数

#### 5、编译

一切准备就绪了，我们开始编译

回到项目根目录进入build目录

cmake ..

make

然后在回到根目录，或打开新的命令窗口

执行 

./bin/paozhu


用浏览器打开

http://localhost/testview 

可以看到视图内容了



### C++生产环境故障排查

框架开启了ASAN，如果在调试时候被ASAN检测到会指出哪一行有问题。

生产环境因为没有输出原因，难以看到。

生产环境编译参数是

```shell
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j8
```

需要安装gdb coredumpctl

框架会隔1分钟左右检查 `log` 目录是否有`restart_server`文件

如果我们需要取现在线程栈样品，可以 `touch log/restart_server` 这样可以让进程重启

可以使用`pstree -aup` 查看进程情况

如果已经取样，我命需要分析进程栈情况


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