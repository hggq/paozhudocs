PaoZhu C++ Web Frameworks
=========================

#### [中文](documentation.html) [English](documentation_en.html)

### 目录

*   [简介](#Abstract)
*   [Paozhu 安装](#Install)
*   [Paozhu 配置](#Config)
*   [Hello World](#Helloworld)
*   [内建JSON对象](#objval)
*   [Session 和 Cookie](#sessioncookie)
*   [get、post和files](#getpostfiles)
*   [ORM 介绍](#ormcontent)
*   [HTML Template 介绍](#Htmltemplate)
*   [JSON和结构体互换函数 json\_encode json\_decode](#jsonencode)
*   [HttpClient 介绍](#httpclient)
*   [故障排除](#Troubleshooting)

### **简介**

paozhu是一款C++ Web开发框架，内置HTTP/1 HTTP/2 ORM,可以轻松优雅写Web程序，打破以往C++写Web程序不方便问题。

paozhu编写了Web开发底层设施，比如多域名绑定、SSL证书管理、Cookie、Session、HTML表单管理 、URL处理、文件上传下载、HttpClient客户端、数据库连接ORM、WebSocket、日志、HTML模板、涵盖Web开发基础。

框架基于C++20为基础，一个是使用新标准，编译器支持完整，一个是让代码更加现代化，框架开启了ASAN和所有错误提示，方便开发阶段发现问题，也可以运行时候结合coredumpctl工具，查看各个线程内存栈。配合智能指针基本杜绝内存泄露和越界问题，框架目前基本没有碰到内存泄露或崩溃情况。

paozhu使用C++，主要是考虑接入大模型（CUDA、文件存储、网络、内存操作）、对比下GO JAVA RUST，都不是很完美，C++也不完美，RUST语法不好看、GO简单但是大模型等没有很深厚文化。目前经验是ASAN和coredumpctl两个工具也能保证C++质量，新编译器也能提示一部分。

### paozhu特色

1.  支持HTTP2。
2.  内置ORM（自研MySQL协议），支持协程模式。
3.  多域名管理、SAAS模式支持。
4.  IO线程和业务线程分开。
5.  内置微型对象，JSON导入导出，类似脚本语言中变量。
6.  内置FastCGI 支持PHP

### paozhu需求环境

paozhu支持`MacOS`、`Linux`、`Windows`系统。

依赖第三方开发包

`OpenSSL` `Zlib` `Brotli` `ASIO`

可选第三方包

`GD` `qrencode`

框架基于C++20以上，确保你的系统支持的编译器支持C++20。

*   `MacOS` 必须`MacOS 11 BigSur`以上，最好是 `MacOS 14 Sonoma`
*   `Ubuntu` 必须是22.04以上
*   `RockyLinux` `AlmaLinux` 必须是9.1以上
*   `Windows` 必须是Win10 编译器最好19.25以上。

### paozhu安装

到官方github库：[https://github.com/hggq/paozhu](https://github.com/hggq/paozhu)

*   [MacOS安装](macos.html) 参考
*   [Ubuntu安装](ubuntu.html) 参考
*   [RockyLinux AlmaLinux](linux.html) 安装 参考
*   [Windows](windows.html) 安装 参考

### paozhu框架技术架构原理

paozhu框架使用了ASIO的线程池，是专门用来做IO使用，比如网络收发，框架也内置有一个业务线程池，专门用来运行业务代码的。

目前框架主要HTTP和HTTPS，两个线程不断倾听连接到来，当用户使用浏览器或Client访问时候产生一个连接，握手后，服务器等待客户端发出HTTP头部信息，然后服务器处理器HTTP协议，如果URL匹配是注册函数，看函数是协程还是普通函数，协程直接运行，如果是普通函数直接丢到业务线程池，如果URL是静态文件，那么直接发送，不走业务线程。

因为C++协程有传染性，所以你在协程注册函数里面运行业务代码时候，需要使用ORM协程方法，如果你在普通函数里面无法发起协程函数只能用ORM普通函数。 一般建议使用一个连接一个线程，业务线程也是有队列的，所以业务代码不要随便使用sleep函数睡眠。

### paozhu配置

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

`reboot_cron` 自动重启进程周期天D 周W 月M 季节S h时间小时 180天凌晨5点重启进程 `links_restart_process` 如果达到连接数也可以重启n后面连接数， ts 开始时段 te结束时段，如果这段时间空闲就会重启。

```
reboot_cron =d180h5 ;MDSW+Hhours reboot process M month D day S season (1 4 7 10) W week  
        clean_cron  =m5t600 ;5-minute interval clean 600 seconds ago inactive connection
        links_restart_process =n9998877ts1te5 ;More than 15000 connections, restart the process from 1:00 am to 5:00 am
        
```

`directorylist=1` 显示目录，如果请求静态文件是目录名，目录下也没有index.html文件会显示目录列表。 生产环境建议设置为0.

`wwwpath=/Users/hzq/paozhu/www/default` `/Users/hzq/paozhu`建议换成你的当前目录名称, 项目下`www/default`，是静态文件目录，如果是多域名建议创建`www/domain.com`这个设置是为SAAS服务的。

`upload_max_size=16777216` 上传文件大小，默认是16M

### SAAS设置

下面几个是SAAS设置可以先不管。

[查看使用SAAS模式](saas.html)

```

        siteid=1
        groupid=0
        alias_domain=
        init_func=
        themes = 
        
```

`client.get_siteid();` 取得 siteid

`client.get_groupid();` 取得 groupid

`client.get_theme();` 取得 theme

`client.theme_view(contt std::string &);` 设置 theme 视图

初学者只要关注 `httpport` `httpsport` `wwwpath` `logpath`设置是否正确, 把所有`/Users/hzq/paozhu`换成你的目录。

### paozhu入门

#### Hello, World 例子

项目目录下 `controller/src/techempower.cpp` 文件例子

```

        #include "techempower.h"    
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

所有注解函数cpp文件必须放在 `controller/src` 目录下

如 `techempower.cpp` 文件必须包含自身文件名的头文件 `#include "techempower.h"` ，`techempower.h`这个文件会自动生成。

编译时候使用CMake Hook，先编译一个可以使用的注解处理程序，然后执行这个程序处理 `controller/src` 目录下所有文件，提取`//@urlpath(null,plaintext)`格式的函数，然后创建相应的头文件，然后生成 注解函数，保存映射函数到 `common/autocontrolmethod.hpp` 文件。

是不是很有Java Spring Boot味道，这样我们可以优雅写URL和函数映射关系，而不用手动注册函数和编写头文件。

### 注解介绍

`//@urlpath(null,plaintext)` 为注解函数，与url映射，比如 http://localhost/plaintext 会访问到`plaintext` 的注解函数。

null表示访问plaintext之前必须先执行的注解函数，例如：带权限的后台，需要验证是否登录

`//@urlpath(islogin,plaintext)` 这样必须先执行`islogin`的注解，返回`OK`表示成功。

```

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

`asio::awaitable<std::string>` 协程注解函数表示里面代码不走业务线程， 如果繁重计算最好使用普通函数，这样走业务线程处理，不会卡IO线程。

`peer->session["userid"]` 表示取得`session`内容，可以在登录成功后保存进去。

`client << "You must login";` 是重载了`<<`运算符,真实内容是保存在`peer->output`。

`co_return "";` 是协程返回结果，请注意和普通函数区别，不知道最好返回空字符串。

下面是普通注册函数,注意返回值，表示走业务线程池，就是一个连接分配一个线程，经典应用。

建议有负载计算最好使用这种普通函数，不然大量计算可能影响并发量，是有可能，如果只是CRUD业务 用那种方式应该问题不大，用协程就不要使用 `std::this_thread::sleep_for(std::chrono::microseconds(1000));` 这种代码。

```

        //@urlpath(null,hello)
        std::string testhello(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            client << " Hello world! 🧨 Paozhu c++ web framework ";
        
            return "";
        }
        
        
```

更多代码使用案例请参考 `controller/src` 目录下的例子

#### 编译你的第一个项目

在你的项目根目录操作。

```

        mkdir build
        cd build
        cmake ..
        make  
        
```

编译完成，可以启动服务器程序了，注意执行程序权限。

```

        cd ..
        MacOS #./bin/paozhu 
        Linux #sudo ./bin/paozhu 
        
```

### 内置微型对象介绍

```
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

*   `set_array()` 设置为数组 可以使用push(v)
*   `set_obj()` 设置为对象KV 可以使用push(k,v)或obj\[key\]=value方式
*   `set_object()` 设置为对象KV 可以使用push(k,v)或obj\[key\]=value方式

#### 判断对象属性

*   `is_array()` 是否是数组
*   `is_obj()` 是否是对象
*   `is_object()` 是否是对象
*   `is_string()` 是否是字符串
*   `is_number()` 是否数字

#### 典型使用方式和HTML模板使用

```
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

```
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

#### 内置微型对象高级方法

*   `obj_val multi_sort(std::string_view key,unsigned char order);` 二维数组按键名排序 order 可以是 SORT\_ASC,SORT\_DESC
*   `obj_val multi_sort(std::string_view key,unsigned char order,std::string_view key2,unsigned char order2);` 二维数组按键名排序 order 可以是 SORT\_ASC,SORT\_DESC，如果有相同二次排序,需要key2 和 order2

#### 内置微型对象高级用法

```
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

主要应用在复杂对象交换程序，如果不是可以使用C++ 内置对象或STL库方式。

### Session 和 Cookie

Session and Cookie 区别，Session数据保存在服务器端，Cookie数据保存在浏览器端，Cookie保存数据有限大小在4Kb。

例子文件 `controller/src/testsessionid.cpp`

```

        //@urlpath(null,testsetsession)
        std::string testsetsession(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            client << "hello world!  add cookie ";
            client << client.get_hosturl();

            int semid = client.get["aaa"].to_int();
            if (semid != 0)
            {
                client.session["aaa"] = semid;
                client << "<br />set session 2222 ";
            }
            else
            {
                client.session["aaa"] = 1111;
            }

            client.save_session();
            client << "<p><a href=\"" << client.get_hosturl() << "/testsetsession?aaa=2222\">2222 session</a></p>";
            client.set_cookie("ccbb", "123456abc", 7200 * 24);
            client.set_cookie("same", "samesite", 7200 * 24, "/", client.host, false, true, "Lax");
            client.set_header("server", "cpphttp");
            client << "<p><a href=\"" << client.get_hosturl() << "/testshowsession\">show</a></p>";
            client << "<p><a href=\"" << client.get_hosturl() << "/testshowsession?sessionid=" << client.get_session_id()
                << "\">session(" << client.get_session_id() << ")</a></p>";
            client << "<p>session aaa:|" << client.session.to_json() << "|</p>";
            return "";
        }
        //@urlpath(null,testshowsession)
        std::string testshowsession(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            client << "hello world!  show cookie<br/>";
            client << "<p><a href=\"" << client.get_hosturl() << "/testsetsession\">add cookie</a></p>";
            client << "<p>session aaa:|" << client.session.to_json() << "|</p>";
            client << "<p>session aaa:|" << client.session["aaa"].to_string() << "|</p>";
            client << "<p>session_id:|" << client.get_session_id() << "|</p>";

            client << "<p>cookie same:" << client.cookie["same"] << "</p>";
            client << "<p>cookie ccbb:" << client.cookie["ccbb"] << "</p>";

            std::string semid = client.get["sessionid"].as_string();
            if (!semid.empty())
            {
                client.set_session_id(semid);
                client << "<p>new session_id:|" << client.get_session_id() << "|</p>";
                client << "<p>new session aaa:|" << client.session["aaa"] << "|</p>";
                client << "<p>cookie same:" << client.cookie["same"] << "</p>";
                client << "<p>cookie ccbb:" << client.cookie["ccbb"] << "</p>";
                client << "<p>session aaa:|" << client.session.to_json() << "|</p>";
            }
            client.view("cookie/show");
            return "";
        }
        
```

`save_session()` 把session值保存到磁盘或内存。

  

### get post 和 files

框架内置了三种处理HTML传值对象，他们都是内置微型对象 `http::obj_val` 类型，三个对象是 `client.get[]` `client.post[]` `client.files[]`

URL 参数传值, 使用 `client.get[]` 获取, 例如 `http://www.xxx.com/aa?username=root&userid=1111` 使用 `client.get["username"].to_string()` 和 `client.get["userid"].to_int()` 取得数据。

HTML 表单数据传值和接收 使用 `client.post[]` 取得数据。

例子文件 `www/default/testpost.html`, 下面是HTML代码。

```

        <form method="post" enctype="multipart/form-data" name="form1" id="form1" action="/tfilepost">
        <p>
        <label for="textfield">Text Field:</label>
        <input type="text" name="textfield" id="textfield">
        </p>
        <p>
        <label for="textfield">Text Field:</label>
        <input type="text" name="aa[]" id="textfield1">
        </p>
        <p>
        <label for="textfield">Text Field:</label>
        <input type="text" name="aa[]" id="textfield2">
        </p>
            <p>
        <label for="textfield">Text Field:</label>
        <input type="text" name="aa[8]" id="textfield3">
        </p>
        <p>
        <label for="textarea">Text Area:</label>
        <textarea name="textarea" id="textarea"></textarea>
        </p>
        <p>
        <label for="fileField">File:</label>
        <input type="file" name="fileField" id="fileField">
        </p>
        <p>&nbsp;</p>
        <p>
        <input type="submit" name="submit" id="submit" value="Submit">
        </p>
    </form>
    
```

服务器端接收代码，注意 `client.post["aa"]` 取值的使用方式。

例子文件 `controller/src/testformpost.cpp`

```

        //@urlpath(null,tfilepost)
        std::string testformmultipart(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            client << "hello world! multipart/form-data ";

            try
            {
                client << "<p>--------------</p>";
                client << "<p>";
                client << client.post.to_json();
                client << "</p>";
                client << "<p>textfield:" << client.post["textfield"] << "</p>";
                client << "<p>aa[]:" << client.post["aa"][0] << "</p>";
                client << "<p>aa[]:" << client.post["aa"][1] << "</p>";
                client << "<p>aa[8]:" << client.post["aa"][8] << "</p>";
                client << "<p>textarea:" << client.post["textarea"] << "</p>";

                client << "<p>fileField:name:" << client.files["fileField"]["name"] << "</p>";
                client << "<p>fileField:filename:" << client.files["fileField"]["filename"] << "</p>";
                client << "<p>fileField:tempfile:" << client.files["fileField"]["tempfile"] << "</p>";
                client << "<p>fileField:size:" << client.files["fileField"]["size"] << "</p>";
                client << "<p>fileField:error:" << client.files["fileField"]["error"] << "</p>";

                client << "<p>submit:" << client.post["submit"] << "</p>";
                client << "<p>--------------</p>";
            }
            catch (std::exception &e)
            {
                client << "<p>" << e.what() << "</p>";
                return "";
            }
            catch (const char *e)
            {
                client << "<p>" << e<< "</p>";
                return "";
            }
            return "";
        }
        
```

`client.files["fileField"]["tempfile"]` 是服务器端临时保存的文件路径, 使用 `std::filesystem::rename(client.files["fileField"]["tempfile"].as_string(), newfilepath)` 函数, 保存到服务器端正确的位置。

  

### ORM介绍

先在按照安装环境教程导入的数据。

paozhu框架内置ORM对象，目前自己分析MySQL协议，方便和ORM整合，而且支持协程模式，这个MySQL官方Client端都没有支持协程。

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
        charset=utf8mb4
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
        charset=utf8mb4
        #ssl=ON
        
```

### ORM 配置

`type` 为类型 就是主从分离，以后可以开发缓存同步，目前先主从。host `127.0.0.1` 填本地的地址，MySQL必须大于等于8版本，因为MySQL9不支持旧的认证了， `pretable` 是表前缀，有时候只有一个数据库权限可以一个数据库放多个业务。 `dbtype` 目前支持MySQL。 `ssl` 可以打开，特别是远程连接时候，启用加密连接。本地的不会启用ssl连接。

### ORM 使用入门

框架目前支持数据库到文件方式，这样修改数据库可以重新生成ORM文件。 当项目编译成功后可以使用下面方法生成cpp文件。

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

输入 1 选择 hello\_world 数据库生成文件。

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
         create table metainfo file: /Users/hzq/paozhu/orm/include/fortune_base.h
        create world table to models 🚗
         create table metainfo file: /Users/hzq/paozhu/orm/include/world_base.h
        (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:x
        
```

输入 x 退出

可以看到 orm 目录下生成文件

```

        orm
        ├── include
        │   ├── fortune_mysql.h
        │   ├── fortune_base.h
        │   ├── world_mysql.h
        │   └── world_base.h
        ├── orm.h
        │
        models
        ├── Fortune.cpp
        ├── World.cpp
        └── include
            ├── Fortune.h
            └── World.h
        
```

orm目录是实体文件，两个文件一个是mysql连接层mysql结尾,操作数据库查询接口，一个是数据表实体映射base.h结尾，也是操作查询结果的接口,这个目录文件更新时候会覆盖，因为与数据库表结构一一对应。

models目录是业务代码文件，我们其实是操作models目录下文件，这两个文件一个cpp一个h文件，自动生成， 但是只生成一次，有了不会覆盖，在自己的项目系统可以加业务代码在里面。

比如 auto myworld = orm::World(); 就是 models 目录下 World.h 这个是默认数据库，比如自带cms演示 auto users = orm::cms::Sysuser();

orm是命名空间，主要是给ORM用 cms是orm.conf数据库配置标签，也是生成的cms命名空间，方便隔离和转换数据库，如果是\[default\]可以省略default.

### ORM设计原理

为什么这样设计呢，其实也是paozhu框架目前比其它框架非常有特色的设计。

1.  一个数据库可以有多个连接，这样我们不用知道使用那个连接。
2.  数据库名字可能很长，像云主机可能自动生成一个几十个字符长的数据库名，甚至有下划线的。
3.  可以个性标签，这样数据库是什么名不重要了。
4.  我们用来做命名空间隔离表对象，这样很多数据库生成的C++类不会冲突。
5.  ORM设计出强大优雅链式写法，Go和Rust设计缺陷无法使用链式写法。

所以`orm::cms::Sysuser();`使用cms隔离了`sysuser`表实体C++类，不会与其它数据库同名表有冲突。 比如`orm::erp::Sysuser();` erp是erp数据库标签，他的数据库是什么名不重要， 就是同样有`sysuser`表也没有关系。

之所以这样设计，就是一个业务系统，一个单体服务器程序，可以有很多数据库，而且他们表名可以有重名。 以后可以有不同数据库，比如MySQL PG等，他们可以分布在其它机器上。 他们可以混合集群，单体服务器程序也可以集群，因为内置了读写分离，写服务器可以同一个， 查询可以固定或动态分配数据库服务器,框架可以适合大业务系统。 目前看一个服务器集成数据库和业务程序为主。

ORM没有多表连接查询，需要手动写多表查询，这样设计上一开始可能多了一次或多次查询，主要是快进快出，容易命中缓存，也符合目前存算分离设计，它在高压力下也表现平缓，初级程序员写业务代码不会出现什么问题。

### ORM使用例子

表模型有两个成员变量很重要

*   data 是单个表数据结构映射
*   record 一个std::vector数组

表数据结构和数据表实体结构

参考文件 `orm/include/world_base.h`

```

        struct meta{
         unsigned  int  id = 0; 
         int  randomnumber = 0;  
        } data;
        
        std::vector<world_base::meta> record;
        
```

#### 协程方式使用ORM

```

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

*   `orm::World();` 是ORM的表模型，默认连接，所以不用default
*   `myworld.lock_conn();` 就是固定一个连接，因为使用ORM连接池方式,会轮训使用连接。
*   `myworld.record.reserve(get_num);` 扩容这个熟悉STL的知道。
*   `myworld.wheresql.clear();` 推荐使`myworld.clearWhere();`方式清除条件。
*   `myworld.where("id", rd_num);` 加一个条件。
*   `co_await myworld.async_fetch_append();` 是高级用法，会附加数据到record对象上。一般使用`co_await myworld.async_fetch();` 会清除record对象，然后重新赋值。

`peer->output = myworld.to_json();` 直接输出JSON到浏览器。

#### 同步使用ORM

正常业务代码在一个线程中运行，就是一个连接一个线程，这个很经典方式。

```

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

`auto topicm = orm::cms::Topic();` 产生一个ORM模型，这个模型源文件在models目录下面,Topic就是数据库表名，如果设置前缀那么框架会自动去除，`topicm.where` 添加查询条件，`asc("parentid").fetch()` 按升序`parentid`查询，`.fetch()`发出查询命令。

#### 分页使用

如果不想要那么多数据可以分页取出，特别是网络业务，需要占用带宽或cpu资源，平时最好按需使用`.select("fieldname1,fieldname2")` 取出字段数据，使用`.limit(pos,offset)`限定范围。

使用`.page(page, 10, 5)`已经自动添加了`.limit(pos,offset)`限定范围，只要传入`page`页码。

```
auto [bar_min, bar_max, current_page, total_page] = artmodel.page(page, 10, 5);

        client.val["pageinfo"].set_object();
        client.val["pageinfo"]["min"]     = bar_min;
        client.val["pageinfo"]["max"]     = bar_max;
        client.val["pageinfo"]["current"] = current_page;
        client.val["pageinfo"]["total"]   = total_page;
        
```

`.page(page, 10, 5)` 返回四个数值，`bar_min` `bar_max`由传入5决定范围， 就是前后2页窗口，每页10个，

ORM where其它方法

`whereLike(fieldname,searchword)` 其实就是 `and fieldname '%searchword%'`设置  
`whereAnd` 其实就是 `and fieldname = val` 设置  
`whereIn` 其实就是 `and fieldname IN(val)` 设置

`whereLT(const std::string &wq, const std::string &val)` 其实就是 `and fieldname < val` 设置

`whereLE(const std::string &wq, const std::string &val)` 其实就是 `and fieldname <= val` 设置

`whereOrLT(const std::string &wq, const std::string &val)` 其实就是 `OR fieldname < val` 设置

`whereOrLE(const std::string &wq, const std::string &val)` 其实就是 `OR fieldname <= val` 设置

  

`whereBT(const std::string &wq, const std::string &val)` 其实就是 `and fieldname > val` 设置

`whereBE(const std::string &wq, const std::string &val)` 其实就是 `and fieldname >= val` 设置

`whereOrBT(const std::string &wq, const std::string &val)` 其实就是 `OR fieldname > val` 设置

`whereOrBE(const std::string &wq, const std::string &val)` 其实就是 `OR fieldname >= val` 设置

ORM执行命令

同步方式

`fetch()` 取回多个结果到 record

`fetch_one()` 取回一个结果到 data

`save()` 把data 数据插入数据库

`update("field1,field2...")` 更新data中的字段到数据库

`remove()` 删除表中数据和where条件配合

  

协程方式

`async_fetch()` 协程方式取回多个结果到 record

`async_fetch_one()` 协程方式取回一个结果到 data

`async_save()` 协程方式把data 数据插入数据库

`async_update("field1,field2...")` 协程方式更新data中的字段到数据库

`async_remove()` 协程方式删除表中数据和where条件配合

更多参考ORM目录下`mysql.h`结尾的文件里面方法。

  

#### ORM 插入、编辑

参考文件 `controller/src/superadmin/supermain.cpp` 数据插入例子。

```

        //@urlpath(superadmin_islogin,superadmin/adduserpost)
        std::string superadmin_adduserpost(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            unsigned int sid = client.post["sid"].to_int();
            auto stinfo      = orm::cms::Siteinfo();

            stinfo.where("agentid", client.session["superid"].to_int()).whereAnd("sid", sid).fetch_one();
            if (stinfo.data.userid == 0)
            {
                client.goto_url("/superadmin/welcome", 3, "没有站点信息！");
                return "";
            }

            std::string expdate = str_trim(client.post["expectdate"].to_string());
            if (!check_isodate(expdate))
            {
                expdate = get_date("%Y-%m-%d");
            }

            auto uinfo = orm::cms::Sysuser();

            std::string username = client.post["username"].to_string();
            std::string password = client.post["password"].to_string();
            uinfo.where("name", username).fetch_one();
            std::string urlmsg = "/superadmin/adduser?sid=";
            urlmsg.append(std::to_string(sid));
            if (uinfo.data.adminid > 0)
            {
                client.goto_url(urlmsg, 3, "用户名已经存在！");
                return "";
            }
            if (username.size() > 26 || username.size() < 4)
            {
                client.goto_url(urlmsg, 3, "用户名必须在4到20之间！");
                return "";
            }
            if (password.size() > 20 || password.size() < 6)
            {
                client.goto_url(urlmsg, 3, "密码必须在4到20之间！");
                return "";
            }
            uinfo.clear();
            uinfo.data.name            = username;
            uinfo.data.password        = md5(password);
            uinfo.data.isopen          = client.post["isopen"].to_int() == 1 ? 1 : 0;
            uinfo.data.companyid       = sid;
            uinfo.data.textword        = password;
            uinfo.data.created_at      = timeid();
            uinfo.data.enddate         = strtotime(expdate);
            uinfo.data.nickname        = client.post["nickname"].to_string();
            uinfo.data.mobile          = client.post["mobile"].to_string();
            uinfo.data.email           = client.post["email"].to_string();
            auto [effect_num, last_id] = uinfo.save();
            if (effect_num == 0)
            {
                client.goto_url(urlmsg, 3, "保存出错！");
                return "";
            }
            urlmsg = "/superadmin/listuser?sid=";
            urlmsg.append(std::to_string(sid));
            client.goto_url(urlmsg, 3, "用户添加成功！");
            return "";
        }
        
```

`auto [effect_num, last_id] = uinfo.save();` 方法返回tuple值，effect\_num 表示插入多少行, last\_id 表示第一个插入数据自增id.

参考文件 `controller/src/admin/topics.cpp` 数据更新例子。

```

        //@urlpath(admin_isloginjson,admin/updatetopicview)
        std::string admin_updatetopicview(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();

            try
            {
                auto topicm          = orm::cms::Topic();
                unsigned char isview = client.post["isview"].to_int() > 0 ? 1 : 0;

                topicm.setIsview(isview);
                topicm.where("userid", client.session["userid"].to_int()).whereAnd("topicid", client.get["id"].to_int());
                client.val["code"] = topicm.update("isview");
                client.val["msg"]  = "ok";
            }
            catch (std::exception &e)
            {
                client.val["code"] = 0;
            }
            client.out_json();
            return "";
        }

        
```

`client.val["code"] = topicm.update("isview");` update("filed1,field2...") 表示更新字段

### paozhu 框架view 视图入门

paozhu 做为 c++ web framework 框架 就是MVC 模式，现在就是说v 这个视图功能

#### 1、视图说明

就是给浏览器显示的内容，其实就是HTML内容，类似PHP脚本语言输出，那我们C++怎么操作呢，也是在HTML里面放C++ 代码，然后编译成为C++的.cpp文件，常驻内存，这样速度也很快，几百个视图文件只要几M内存，一个公司项目也就是1000左右页面。估计不到10M内存，如果用脚本语言运行时会还要大量I/O读取文件。 框架直接编译其为程序，不用I/O读取了，速度极快。

#### 2、创建视图

我们在view目录

创建 login 目录 然后再创建一个login.html文件在login目录里面

```

        view
        └── login
            └── login.html
        
```

大概这样子

#### login.html 文件内容

```
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

`include_sub("home/header",obj);`

说明还包括一个子页面，我们再在view创建一个子页面目录home

```

        view
        ├── home
        │   └── header.html
        └── login
            └── login.html    
        
```

大概这样子

#### header.html 内容其实就是网页头部信息

```

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

echo<<vinfo.get\["aa"\].to\_string();

这个就是 视图标签 c++ 代码用<%c %>包括起来

echo 是缓冲区，就是跟外面html一起拼起来

变成c++代码

类似这样子

```

        echo<<"导航测试 |";
        echo<<vinfo.get["aa"].to_string();
        echo<<"| </h3>";
         
```

具体可以看 `viewsrc/view/home/header.cpp` 代码。

#### 3、 编译视图到cpp文件

在网站根目录下运行

./bin/paozhu\_cli

选择f 生成文件

```

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

```

        viewsrc
        ├── include
        │   ├── regviewmethod.hpp
        │   └── viewsrc.h
        └── view
            ├── home
            │   └── header.cpp
            └── login
                └── login.cpp
        
```

大概这样

我们两个 login.html header.html已经转为cpp文件

include 目录里面两个文件

viewsrc.h 是所有视图文件函数的定义，以后可能会分开，一个视图文件对一个头文件。

regviewmethod.hpp 是视图注册函数，框架调用这个注册到框架

#### viewsrc.h 文件内容

```

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
        
            std::string header(const struct view_param &vinfo,http::obj_val &obj);
        }
        
        namespace login{ 
        
            std::string login(const struct view_param &vinfo,http::obj_val &obj);
        }
        
        
        }
        
        }
        #endif
        
        
```

可以看到视图都放在命名空间里面，这样，一个目录里面和其它目录里面视图文件重名也没有冲突。

#### regviewmethod.hpp 注册函数文件

```

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

按照hello world入门那章

`controller/src`目录 创建 `testview.cpp` 文件

大概这样子

#### testview.cpp

```
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

./bin/paozhu #在Linux 使用 sudo ./bin/paozhu

用浏览器打开

http://localhost/testview

可以看到视图内容了

### JSON和结构体互换函数 json\_encode json\_decode

框架内置了 结构体和JSON互换功能，减轻自己写代码压力

#### 使用方法

框架提供了 `json_encode` `json_decode`两个函数操作 结构体或类对象

std::string json\_encode(obj)

std::string json\_encode(std::vector<obj>)

表示把对象编码为JSON 支持数组或单个对象

int json\_decode(obj,json\_string)

int json\_decode(std::vector<obj>,json\_string)

表示解码JSON字符串到对象

#### 原理

`common/json_reflect_headers.h` 是所有反射对象引用的头文件

这个文件是`paozhu_cli`生成的

你要在libs目录下创建相应的类型文件，然后运行paozhu\_cli生成， 框架是直接分析类型文件生成相应的代码，目前支持常用的结构体， 结构体可以多层嵌套，或引用同样是反射的结构体。

#### 使用例子

创建测试文件 `libs/department/department_type.h`

```

            #ifndef LIBS_DEPARTMENT_TYPE_H
            #define LIBS_DEPARTMENT_TYPE_H
            #include <iostream>
            #include <string>
            #include <vector>
            #include <sstream>
            #include <sstream>
            #include "unicode.h"
            
            namespace psy
            { 
            //@reflect json to_json from_json
            struct department_outjson_t
            {
              unsigned int id          = 0;
              unsigned int key         = 0;
              unsigned int value       = 0;
              unsigned int parentid    = 0;
              unsigned int bianzhi_num = 0;
              bool isopen              = true;
              bool _is_use             = false;
              std::string title;
              std::string desc;
              std::vector<department_outjson_t> children;
              std::string to_json(std::string aa="",int offset=0);
              unsigned int from_json()
              {
                    //**aaaaa
                    /*
                    aaaa [][}]
                    */
                    char b='}';
                    if(b=='{')
                    {
                        std::cout<<"assss}sss}{ssss}sss}"<<std::endl;
                    }
                    return 0;
              }
            };
            
            //@reflect json to_json from_json
            struct department_listoutjson_t
            {
              unsigned int code=0;
              struct department_tables
              {
                std::vector<department_outjson_t> list;
                unsigned int total=0;
              } data;
              std::vector<std::vector<std::string>> names;
            };
            
            } // namespace psy
            #endif            
        
```

`//@reflect json` 是框架分析源码提取标志，必须是这个开头的struct或class,不然不起作用。

我们创建两个结构体，后面一个还嵌套一个，这样方便业务代码操作 to\_json from\_json 是测试框架分析源代码是不是正确跳过这些函数

下划线开头不会输出到JSON字符串里面

#### 生成对象 json\_encode json\_decode 实体代码

```

        sudo ./bin/paozhu_cli
        
```
```

        ./bin/paozhu_cli  model | view | viewtocpp | control   
        🎉 Welcome to use cli to manage your MVC files。
        (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
        
```

输入 j

可以看到生成文件了

```

        1 /Users/hzq/paozhu/libs/department/department_type_jsonreflect.cpp
        (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
        
```

#### json\_encode json\_decode 使用

可以参考 `controller/src/testjsonreflect.cpp`

```

        #include <chrono>
        #include <thread>
        #include "httppeer.h"
        #include "testjsonreflect.h"
        #include "json_reflect_headers.h"
        #include "array_to_tree.h"
        namespace http
        {
        //@urlpath(null,testjsonreflect)
        std::string testjsonreflect(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->getpeer();
            // client << " json reflect 🧨 Paozhu c++ web framework ";

            psy::department_outjson_t deps_json_one;
            std::vector<psy::department_outjson_t> depsjsonlist;

            deps_json_one.id          = 38;
            deps_json_one.key         = 38;
            deps_json_one.value       = 38;
            deps_json_one.parentid    = 0;
            deps_json_one.isopen      = true;
            deps_json_one.title       = "First Item 第一条";
            deps_json_one.desc        = "First Item 第一条备注";
            deps_json_one.bianzhi_num = 12;

            depsjsonlist.push_back(deps_json_one);

            deps_json_one.id          = 48;
            deps_json_one.key         = 48;
            deps_json_one.value       = 48;
            deps_json_one.parentid    = 0;
            deps_json_one.isopen      = true;
            deps_json_one.title       = "Second Item 第二条";
            deps_json_one.desc        = "Second memo 第二条备注";
            deps_json_one.bianzhi_num = 16;

            depsjsonlist.push_back(deps_json_one);

            deps_json_one.id          = 58;
            deps_json_one.key         = 58;
            deps_json_one.value       = 58;
            deps_json_one.parentid    = 48;
            deps_json_one.isopen      = true;
            deps_json_one.title       = "Three Item 第二条01";
            deps_json_one.desc        = "Three memo 第二条01备注";
            deps_json_one.bianzhi_num = 22;

            depsjsonlist.push_back(deps_json_one);

            psy::department_listoutjson_t depout_data;

            array_to_tree<psy::department_outjson_t>(depout_data.data.list, depsjsonlist);

            depout_data.code = 0;
            // depout_data.data.list=depsjsonlist; //has array_to_tree
            depout_data.data.total = 0;

            std::string jsondep_str = psy::json_encode(depout_data);

            psy::department_listoutjson_t new_depout_data;
            psy::json_decode(new_depout_data, jsondep_str);
            std::cout << "data.list:" << depout_data.data.list.size() << std::endl;
            std::cout << "data.list:" << new_depout_data.data.list.size() << std::endl;

            std::string jsondep_str_temp = psy::json_encode(new_depout_data);

            client << jsondep_str_temp;
            client.out_jsontype();
            return "";
        }

        } // namespace http    
        
```

我们先把数组转为树，然后测试对象编码为JSON字符串

先std::string jsondep\_str = psy::json\_encode(depout\_data);

然后 在用这个 jsondep\_str 解码到新的对象

psy::json\_decode(new\_depout\_data, jsondep\_str);

然后我们再次 编码 std::string jsondep\_str\_temp = psy::json\_encode(new\_depout\_data);

然后输出 jsondep\_str\_temp 看看是不是符合我们的预期

### HttpClient 介绍

例子文件 `controller/src/testcowaitclient.cpp`

同步使用方式

```

            //@urlpath(null,testcowaitclient5)
            std::string testhttpclient_cowait_post(std::shared_ptr<httppeer> peer)
            {
                httppeer &client = peer->get_peer();
                client << "hello world!  test testhttpclient_cowait_body";

                std::shared_ptr<http::client> a = std::make_shared<http::client>();

                a->get("http://www.xxxxxx.net/");
                a->add_header("Connection", "keep-alive");
                a->send();
                if (a->get_status() == 200)
                {
                    //  client << a->getBody();
                    std::cout << "http://www.xxxxxx.net/login.php" << std::endl;
                    a->post("http://www.xxxxxx.net/login.php");
                    a->add_header("Connection", "keep-alive");
                    a->data["user_name"] = "admin";
                    a->data["user_pass"] = "123456";
                    a->data["action"]    = "login";
                    a->send();
                    if (a->get_status() == 200)
                    {
                        //client << a->getBody();
                        std::cout << "http://www.xxxxxx.net/main.php" << std::endl;
                        a->get("http://www.xxxxxx.net/main.php");
                        a->requst_clear();
                        a->add_cookie("PHPSESSID", a->state.cookie["PHPSESSID"]);
                        a->add_header("Connection", "Close");

                        a->send();
                        if (a->get_status() == 200)
                        {
                            std::cout << a->get_body() << std::endl;
                            //client << a->getBody();
                        }
                    }
                }
                else
                {
                    client << a->error_msg;
                    client << "+++++not content++++";
                }
                return "";
            }
            
```

协程中使用方式

```

            //@urlpath(null,testcowaitclient22)
            asio::awaitable<std::string> testhttpclient22_cowait_body(std::shared_ptr<httppeer> peer)
            {
                httppeer &client = peer->get_peer();
                client << "hello world! co_await test localhost http://127.0.0.1addpost.html ";

                std::shared_ptr<http::client> a = std::make_shared<http::client>();

                a->get("http://127.0.0.1/addpost.html");
                co_await a->async_send();
                if (a->get_status() == 200)
                {
                    client << a->get_body();
                }
                else
                {
                    client << "+++++not content++++";
                }
                co_return "";
            }
            
```

协程使用了 `async_` 前缀。

  

### C++生产环境故障排查

框架开启了ASAN，如果在调试时候被ASAN检测到会指出哪一行有问题。

生产环境因为没有输出原因，难以看到。

生产环境编译参数是

```
mkdir build
        cd build
        cmake .. -DCMAKE_BUILD_TYPE=Release #OR cmake .. -DCMAKE_BUILD_TYPE=Release -DENABLE_GD=ON
        make -j8
        
```

需要安装gdb coredumpctl

框架会隔1分钟左右检查 `log` 目录是否有`restart_server`文件

如果我们需要取现在线程栈样品，可以 `touch log/restart_server` 这样可以让进程重启

可以使用`pstree -aup` 查看进程情况

如果已经取样，需要分析进程栈情况

核心coredump查看

```
coredumpctl list
        coredumpctl info
        
```

直接在线看,1524是 info 显示的进程号，也就是之前`pstree -aup` 看的

```
coredumpctl gdb 1524
```

`bt`可以查看

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
          #0  http::hash_objkey (key="data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2My"...) at /www/paozhu/vendor/httpserver/src/request.cpp:54
          #1  0x000000000060032f in http::obj_val::operator[] (this=0x7fd9cc01e520, key="data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2MyU2RiUyRiU3MCUzOSU3OSU3MSU2RSU2NCUyRCU2QyU3MiU2QiU2NCU2NyU1RiU"...) at /www/paozhu/vendor/httpserver/src/request.cpp:315
          #2  0x00000000005a990c in http::httpparse::procssxformurlencoded (this=0x7fd9b400d370) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:389
          #3  0x00000000005b1bfa in http::httpparse::process (this=0x7fd9b400d370, buffer=0x2e223c0 "POST /public/static/lib/webuploader/0.1.5/server/preview.php HTTP/1.1\r\nHost: www. paozhu.org\r\nUser-Agent: Mozilla/5.0 AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0\r\nAccept-Encoding: gzip, deflate"..., buffersize=964) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:2823
          
```

[Reference to CMakeLists.txt](CMakeLists_debug_product.txt)