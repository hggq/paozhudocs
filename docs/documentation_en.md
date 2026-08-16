  PaoZhu C++ Web Frameworks /\* Light mode \*/ body { font-family:'PingFang SC','Helvetica Neue','Microsoft YaHei UI','Microsoft YaHei','Noto Sans CJK SC',Sathu,EucrosiaUPC,Arial,Helvetica,sans-serif; font-size:16px; line-height:1.45em; } code{ background-color: #EEE; border-radius: 5px; padding: 3px; } @media (prefers-color-scheme: light) { body { color: black; background-color: white; font-size: 14px; } body pre { padding: 5px; overflow: auto; line-height: 1.45em; background-color: #EEE; border-radius: 6px; } body pre { word-wrap: normal; } body pre > code { padding: 0; margin: 0; word-break: normal; white-space: pre; background: transparent; border: 0; } body pre > code { white-space: pre-wrap; } code{ background-color: #EEE; border-radius: 5px; padding: 3px; } } /\* Dark mode \*/ @media (prefers-color-scheme: dark) { body { color: white; background-color: black; } body pre { padding: 5px; overflow: auto; line-height: 1.45em; background-color: #333; border-radius: 6px; } body pre { word-wrap: normal; } body pre > code { padding: 0; margin: 0; word-break: normal; white-space: pre; background: transparent; border: 0; } body pre > code { white-space: pre-wrap; } code{ background-color: #333; border-radius: 5px; padding: 3px; } } @media (min-width: 1200px) { .container { width: 1080px; margin: 0 auto; } }

PaoZhu C++ Web Frameworks
=========================

#### [中文](documentation.html) [English](documentation_en.html)

### Contents

*   [Abstract](#Abstract)
*   [Paozhu Install](#Install)
*   [Paozhu Config](#Config)
*   [Hello World](#Helloworld)
*   [Introduction to Built in Micro Objects(JSON)](#objval)
*   [Session and Cookie](#sessioncookie)
*   [get post and files](#getpostfiles)
*   [ORM Introduction](#ormcontent)
*   [HTML Template View Description](#Htmltemplate)
*   [JSON and struct conversion function json\_encode json\_decode](#jsonencode)
*   [HttpClient Introduction](#httpclient)
*   [Troubleshooting in C++ Production Environment](#Troubleshooting)

### **Abstract**

Paozhu is a C++ Web development framework with built-in HTTP/1/HTTP/2 ORM, making it easy and elegant to write web programs, breaking the previous inconvenience of writing web programs in C++.

Paozhu has developed the underlying infrastructure for web development, such as multi domain binding, SSL certificate management, cookies, sessions, HTML form management, URL processing, file upload and download, HttpClient, ORM, WebSocket, Logs, HTML Template, covering the basics of web development.

The framework is based on C++20, using new standards with complete compiler support, and modernizing the code. The framework has enabled ASAN and all error prompts(-Wall), making it easy to identify problems during the development phase. It can also be combined with the coredumpctl tool at runtime to view the memory stacks of various programs. Combined with intelligent pointers, the framework has basically eliminated memory leaks and out of bounds issues, and has not encountered any memory leaks or crashes so far.

Paozhu uses C++ mainly to consider the integration of large models (CUDA, file storage, network, memory operations), compared to GO JAVA RUST, which are not very perfect. C++ is also not perfect, RUST syntax is not good-looking, GO is simple but lacks AI culture in Big models, etc. At present, the experience is that ASAN and coredumpctl tools can also ensure the quality of C++, and the new compiler can also provide some hints.

### paozhu Feature

1.  Supports HTTP2.
2.  Built in ORM (self-developed MySQL protocol), supporting coroutine mode.
3.  Multi domain management and SAAS mode support.
4.  Separate IO threads from business threads.
5.  Built in micro objects, JSON import and export, similar to variables in scripting languages.
6.  Built in FastCGI supports PHP

### paozhu Framework technology architecture principle

The Paozhu framework uses ASIO's thread pool, which is specifically designed for IO usage, such as network sending and receiving. The framework also has a built-in business thread pool, which is dedicated to running business code.

At present, the frameworks mainly use HTTP and HTTPS, with two threads constantly listening for connections to arrive. When a user accesses using a browser or client, a connection is generated, and after handshake, the server waits for the client to send HTTP header information. Then, the server processes the HTTP protocol. If the URL matches, it registers a function and checks whether the function is a coroutine or a regular function. The coroutine runs directly. If it is a regular function, it is thrown directly into the business thread pool. If the URL is a static file, it is sent directly without going through the business thread.

Because C++coroutines are contagious, when running business code in coroutine registration functions, you need to use ORM coroutine methods. If you cannot initiate coroutine functions in regular functions, you can only use ORM regular functions.

It is generally recommended to use one connection to one thread, and business threads also have queues, so business code should not use the sleep function to sleep casually.

### paozhu Environment

Paozhu supports `MacOS` `Linux` and `Windows` systems.

Uses third-party dependencies

`OpenSSL` `Zlib` `Brotli` `ASIO`

Optional third-party dependencies

`GD` `qrencode`

The framework is based on C++20 or above, ensuring that your system supports compilers that support C++20.

*   `MacOS` `MacOS 11 BigSur` above,suggestion `MacOS 14 Sonoma`
*   `Ubuntu` 22.04 above
*   `RockyLinux` `AlmaLinux` 9.1 above
*   `Windows` Win10 Compiler 19.25 or above。

### Paozhu install

Download [https://github.com/hggq/paozhu](https://github.com/hggq/paozhu)

*   [MacOS install](https://hggq.github.io/paozhudocs/macos_en.html)
*   [Ubuntu install](https://hggq.github.io/paozhudocs/ubuntu_en.html)
*   [RockyLinux AlmaLinux install](https://hggq.github.io/paozhudocs/linux_en.html)
*   [Windows install](https://hggq.github.io/paozhudocs/windows_en.html)

### paozhu Config

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

`reboot_cron` Automatic restart process cycle day D week W month M season S h time hour 180 days 5 am restart process `links_restart_process` If the number of connections is reached, you can also restart the number of connections after n, The ts start period and te end period will restart if they are idle during this period.

```
reboot_cron =d180h5 ;MDSW+Hhours reboot process M month D day S season (1 4 7 10) W week  
        clean_cron  =m5t600 ;5-minute interval clean 600 seconds ago inactive connection
        links_restart_process =n9998877ts1te5 ;More than 15000 connections, restart the process from 1:00 am to 5:00 am
        
```

`directorylist=1` Display directory. If the requested static file is a directory name and there is no index.html file in the directory, a directory list will be displayed. It is recommended to set the production environment to 0

`wwwpath=/Users/hzq/paozhu/www/default` `/Users/hzq/paozhu` Suggest changing to your current directory name, Under the project, 'www/default' is a static file directory. If it is a multi domain, it is recommended to create a 'www/domain.com' setting for SAAS services.

`upload_max_size=16777216` Upload file size, default is 16M

### SAAS settings

The following are SAAS settings that can be ignored for now .

[View using SAAS mode](saas_en.html)

```

        siteid=1
        groupid=0
        alias_domain=
        init_func=
        themes = 
        
```

`client.get_siteid();` get siteid

`client.get_groupid();` get groupid

`client.get_theme();` get theme

`client.theme_view(contt std::string &);` set theme view file

Beginners only need to understand `httpport` `httpsport` `wwwpath` `logpath` Ensure that the settings are correct, Replace all '/Users/hzq/paozhu' with your directory.

### paozhu Introduction

#### Hello World Example

Example of `controller/src/techepower.cpp` file in project directory

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

### Annotation Fundamentals

All annotation function cpp files must be placed in the`controller/src`directory.

This `techempower.cpp` file must contain its own file name `#include "techempower.h"`, The `techempower.h` file will be automatically generated.

When compiling, use the CMake Hook to first compile an annotation handler that can be used, and then execute this program to handle `controller/src` Extract functions in the format of `//@urlpath(null, plaintext)` from all files in the directory, create corresponding header files, and then generate Annotate the function and save the mapping function to the `common/autocontrolmethod.hpp` file.

Doesn't it have a strong Java Spring Boot flavor so that we can elegantly write URL and function mapping relationships without manually registering functions and writing header files.

### Annotation Example

`//@urlpath(null,plaintext)` annotate functions，Mapping with URL，Example http://localhost/plaintext Will access the annotation function of 'plaintext'.

null represents the annotation function that must be executed before accessing plaintext, for example: a backend with permissions that requires verification of login status

`//@urlpath(islogin,plaintext)` This requires first executing the 'islogin' annotation and returning 'OK' to indicate success.

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

`asio::awaitable<std::string>` The coroutine annotation function indicates that the code inside does not go through business threads, If heavy calculations are required, it is best to use regular functions so that business threads can handle them without blocking IO threads.

`peer->session["userid"]` get `session` content, The content saved after successful login before。

`client << "You must login";` It is overloaded with the<<operator, and the actual content is saved in peer->output.

`co_return "";` It is a coroutine that returns the result. Please note that it is different from a regular function, and it is best to return an empty string if you are unsure.

The following is a regular registration function, pay attention to the return value, indicating that it goes through the business thread pool, which assigns one thread to each connection. This is a classic application.

It is recommended to use this ordinary function for load computing, otherwise a large amount of computation may affect concurrency, which is possible if it is only for CRUD business It shouldn't be a problem to use that method. When using coroutines, don't use `std::this_thread::sleep_for(std::chrono::microseconds(1000));` This type of code.

```

        //@urlpath(null,hello)
        std::string testhello(std::shared_ptr<httppeer> peer)
        {
            httppeer &client = peer->get_peer();
            client << " Hello world! 🧨 Paozhu c++ web framework ";
        
            return "";
        }
        
        
```

For more code usage cases, please refer to the examples in the `controller/src` directory

#### Compile your first project

Operate in the root directory of your project.

```

        mkdir build
        cd build
        cmake ..
        make  
        
```

The compilation is complete, and the server program can now be started. Please pay attention to the execution permissions of the program.

```

        cd ..
        MacOS #./bin/paozhu 
        Linux #sudo ./bin/paozhu 
        
```

### Introduction to Built in Micro Objects

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

`http::obj_val` is a built-in micro object in the framework that can be used to import and export `from_json` and `to_json` object conversions.

Does it have a scripting language flavor? It can save values and strings, and can also save tree structures.

`http::obj_val` is 16bytes size，one `KV` Object 64bytes size。

`hval["aaa"]` is `KV` Object。

`http::obj_val` Built in methods for objects

*   `set_array()` set is array and push(v)
*   `set_obj()` set is KV and use push(k,v) or obj\[key\]=value
*   `set_object()` set is KV and use push(k,v) or obj\[key\]=value

#### More methods

*   `is_array()` it is an array or not
*   `is_obj()` it is an object or not
*   `is_object()` it is an object or not
*   `is_string()` it is an string or not
*   `is_number()` it is an number or not

#### Typical usage and HTML template usage

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

#### Using in HTML templates

```
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

*   `obj_val multi_sort(std::string_view key,unsigned char order);` 2D array key name sorting, order is SORT\_ASC or SORT\_DESC.
*   `obj_val multi_sort(std::string_view key,unsigned char order,std::string_view key2,unsigned char order2);` 2D array key name sorting, order is SORT\_ASC or SORT\_DESC, If there is the same secondary sorting,need key2 and order2.

#### Micro Objects advanced methods example

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

Mainly used for complex object swapping programs, if it is not a complex object, C++ built-in POD, class objects, or STL library methods can be used.

  

### Session and Cookie

The difference between Session and Cookie is that session data is stored on the server side, cookie data is stored on the browser side, and cookie data has a limited size of 4Kb.

Example file `controller/src/testsessionid.cpp`

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

`save_session()` save session values to disk or memory.

  

### get post and files

The framework has three built-in methods for handling HTML data transmission and processing, all of which are built-in micro objects of type `http::obj_val`, The three objects are `client.get[]` `client.post[]` `client.files[]`

URL parameter value transmission, use `client.get[]` get values, example `http://www.xxx.com/aa?username=root&userid=1111` use `client.get["username"].to_string()` and `client.get["userid"].to_int()` get the values.

HTML form post data use `client.post[]` get the values

Example file `www/default/testpost.html`, The HTML code is as follows.

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

Server side receives form data code, Pay attention to the usage of the value of `client.post["aa"]`.

Example file `controller/src/testformpost.cpp`

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

`client.files["fileField"]["tempfile"]` save to temporary path on the server side, use `std::filesystem::rename(client.files["fileField"]["tempfile"].as_string(), newfilepath)` function, Save to the correct server side location.

  

### ORM Introduction

The data imported in the installation environment section.

The paozhu framework comes with built-in ORM objects and utilizes the built-in MySQL protocol library, eliminating the need for third-party libraries and facilitating integration with ORM. It also supports C++ Coroutine mode. The MySQL official client does not support Coroutines.

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

### ORM Config

`type` The type is Master-Slave Replication and cache synchronization can be developed in the future. Currently, master-slave is preferred. Host '127.0.0.1' fills in the local address, MySQL must be greater than or equal to version 8 because MySQL 9 does not support old authentication.

`pretable` It is a table prefix, sometimes only one database permission can store multiple businesses in one database.

`dbtype` Currently supports MySQL.

`SSL` can be opened, especially when connecting remotely, enabling encrypted connections. Local SSL connections will not be enabled.

### ORM Usage

The framework currently supports database to create cpp file conversion, so modifying the database can regenerate ORM files.

After the project is successfully compiled, the following method can be used to generate cpp files.

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
         create table metainfo file: /Users/hzq/paozhu/orm/include/fortune_base.h
        create world table to models 🚗
         create table metainfo file: /Users/hzq/paozhu/orm/include/world_base.h
        (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:x
        
```

Enter x to exit

You can see the generated files in orm directory.

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

The ORM directory is an entity file, consisting of two files: one is the end of the mysql.h for operating database query interfaces, and the other is the end of the data table entity mapping base.h, which is also an interface for operating query results. When updating this directory file, it will be overwritten because it corresponds one-to-one with the database table structure

The models directory is the business code file, and we actually manipulate the files in the models directory. These two files, one cpp and one h, are automatically generated, but they are only generated once and will not be overwritten. In our own project system, we can add business code to them.

For example

auto myworld = orm::World(); models directory World.h

This is the default database, such as the built-in CMS demo auto users = orm::cms::Sysuser();

orm is namespae, Mainly used for ORM business CMS is the orm.conf file database configuration tag and also the generated CMS namespace, which facilitates database isolation and transformation. If it is \[default\], default can be omitted

### ORM design philosophy

Why is it designed in this way? Actually, it is also a unique design of the Paozhu framework compared to other frameworks.

1.  A database can have multiple connections, so we don't have to know which connection to use.
2.  The database name may be very long, for example, a cloud host may automatically generate a database name that is tens of characters long, even with underscores.
3.  Personalized tags can be used, so that the name of the database is not important anymore.
4.  We use it to create namespace isolation table objects, so that many C++classes generated by databases do not conflict.
5.  ORM designs powerful and elegant chain writing, while Go and Rust have design flaws that prevent the use of chain writing.

So `orm::cms::Sysuser();` Using CMS to isolate the 'sysuser' table entity C++ class will not conflict with tables with the same name in other databases. For example, `orm::erp::Sysuser();` ERP is an ERP database tag, and the name of its database is not important, It doesn't matter if there is also a `sysuser` table.

The reason for this design is that it is a business system, a single server program that can have many databases, and their table names can have duplicate names. In the future, there can be different databases, such as MySQL PG, which can be distributed on other machines. They can mix clusters, and individual server programs can also be clustered, because they have built-in read-write separation, and the write servers can be the same, Querying can allocate database servers in a fixed or dynamic manner, and the framework can be suitable for large business systems. Currently, the focus is on integrating a server with a database and business programs.

ORM does not have multi table join queries and requires manual writing of multi table queries. This may result in one or more additional queries at the beginning of the design, mainly due to fast in and fast out, which makes it easy to hit the cache and is in line with the current storage computing separation design. It also performs smoothly under high pressure, and novice programmers will not encounter any problems when writing business code.

### ORM usage example

The table model has two important member variables

*   data is a mapping of a single table data structure
*   record is a std::vector array

Table Data Structure and Data table entity structure

Reference file `orm/include/world_base.h`

```

        struct meta{
         unsigned  int  id = 0; 
         int  randomnumber = 0;  
        } data;
        
        std::vector<world_base::meta> record;
        
```

#### ORM use for Coroutine

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

*   `orm::World();` It is an ORM table model with default connections, so there is no need for default
*   `myworld.lock_conn();` It's about fixing a connection, because using ORM connection pool method will rotate the use of connections.
*   `myworld.record.reserve(get_num);` The std::vector reserve。
*   `myworld.wheresql.clear();` Recommend using `myworld.clearWhere()` Method to clear conditions。
*   `myworld.where("id", rd_num);` Add where。
*   `co_await myworld.async_fetch_append();` It is an advanced usage that will attach data to the record object. Generally, `co_await myworld.async_fetch();` is used\` It will clear the record object and then reassign it.

`peer->output = myworld.to_json();` Directly output JSON to the browser.

#### Synchronize the use of ORM

Normal business code runs in a thread, one thread by one connect at a time, which is a classic way.

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

`httppeer &client = peer->get_peer();` Reference connection object

`auto topicm = orm::cms::Topic();` Create an ORM model object, with the model source file located in the models directory,Topic is the database table name，If a prefix is set, the framework will automatically remove it,`topicm.where` add sql where，`asc("parentid").fetch()` order `parentid` asc query ，`.fetch()` send query command。

#### Page usage

If you don't want so much data to be paginated and retrieved, especially for network services that require bandwidth or CPU resources，It is best to use it as needed `.select("fieldname1,fieldname2")` Retrieve field data, use `.limit(pos,offset)` for range.

Use `.page(page, 10, 5)` It has been automatically added `.limit(pos,offset)` to sql string,now only input `page` number.

```
auto [bar_min, bar_max, current_page, total_page] = artmodel.page(page, 10, 5);
        
        client.val["pageinfo"].set_object();
        client.val["pageinfo"]["min"]     = bar_min;
        client.val["pageinfo"]["max"]     = bar_max;
        client.val["pageinfo"]["current"] = current_page;
        client.val["pageinfo"]["total"]   = total_page;
        
```

`.page(page, 10, 5)` Return four numerical values,`bar_min` `bar_max` The range is determined by the input of 5, It consists of two pages of windows, with 10 per page,

ORM where Other Methods

`whereLike(fieldname,searchword)` It's equivalent to `and fieldname '%searchword%'` alias

`whereAnd` It's equivalent to `and fieldname = val` alias

`whereIn` iIt's equivalent to `and fieldname IN(val)` alias

`whereLT(const std::string &wq, const std::string &val)` It's equivalent to `and fieldname < val` alias

`whereLE(const std::string &wq, const std::string &val)` It's equivalent to `and fieldname <= val` alias

`whereOrLT(const std::string &wq, const std::string &val)` It's equivalent to `OR fieldname < val` alias

`whereOrLE(const std::string &wq, const std::string &val)` It's equivalent to `OR fieldname <= val` alias

  

`whereBT(const std::string &wq, const std::string &val)` It's equivalent to `and fieldname > val` alias

`whereBE(const std::string &wq, const std::string &val)` It's equivalent to `and fieldname >= val` alias

`whereOrBT(const std::string &wq, const std::string &val)` It's equivalent to `OR fieldname > val` alias

`whereOrBE(const std::string &wq, const std::string &val)` It's equivalent to `OR fieldname >= val` alias

ORM Execute Command

Synchronous mode

`fetch()` Get multiple results to variable record

`fetch_one()` Get a result to variable data

`save()` Insert variable data into database table

`update("field1,field2...")` Update fields in variable data to the database

`remove()` Delete data from the table and match it with the `where` condition

  

Coroutine mode

`async_fetch()` Get multiple results to variable record using coroutine method

`async_fetch_one()` Get a result to variable data through coroutine method

`async_save()` Insert variable data into database table using coroutine method

`async_update("field1,field2...")` Update fields in variable data to the database using coroutine method

`async_remove()` Delete data from the table and match it with the `where` condition using coroutine method

For more information, please refer to the methods in the file ending with `mysql.h` in the ORM directory.

  

#### ORM insertion and update

Reference documents `controller/src/superadmin/supermain.cpp` Example of data insertion.

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
                client.goto_url("/superadmin/welcome", 3, "No site information!");
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
                client.goto_url(urlmsg, 3, "The username already exists!");
                return "";
            }
            if (username.size() > 26 || username.size() < 4)
            {
                client.goto_url(urlmsg, 3, "The username must be between 4 and 20!");
                return "";
            }
            if (password.size() > 20 || password.size() < 6)
            {
                client.goto_url(urlmsg, 3, "The password must be between 4 and 20!");
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
                client.goto_url(urlmsg, 3, "Save error!");
                return "";
            }
            urlmsg = "/superadmin/listuser?sid=";
            urlmsg.append(std::to_string(sid));
            client.goto_url(urlmsg, 3, "User added successfully!");
            return "";
        }
        
```

`auto [effect_num, last_id] = uinfo.save();` The method returns a tuple value, where effectod\_num represents the number of rows inserted, and last\_id represents the self increasing id of the first inserted data.

Reference documents `controller/src/admin/topics.cpp` Example of data update.

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

`client.val["code"] = topicm.update("isview");` update("filed1,field2...") Indicates the need to update fields

### Paozhu Framework View Beginner's Guide

Paozhu, as a C++web framework framework, is the MVC pattern, which now refers to the view function of V

#### 1、View Description

It is the content displayed to the browser, which is actually HTML content, similar to PHP scripting language output. So how do we operate C++? We put C++code in HTML and compile it into a C++. cpp file, which is resident in memory. This is also very fast. Hundreds of view files only require a few MB of memory, and one company project is about 1000 pages. It is estimated to have less than 10MB of memory, and if running in a scripting language, it will require a large amount of I/O to read files. The framework compiles it directly into a program without the need for I/O reading, which is extremely fast.

#### 2、Create View File

We are in the view directory

Create a login directory and then create a login.html file in the login directory

```

        view
        └── login
            └── login.html
        
```

Probably like this

#### login.html file content

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

The description also includes a subpage, and we will create a subpage directory called home in the view

```

        view
        ├── home
        │   └── header.html
        └── login
            └── login.html    
        
```

Probably like this

#### The content of header.html is actually the header information of the webpage

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
          <li><a class="active" href="/">HOME</a></li>
          <li><a href="#news">News</a></li>
          <li><a href="#contact">Contact</a></li>
          <li style="float:right"><a href="#about">About</a></li>
        </ul>
        
        <h3> subpage include_sub("home/header")Nav test |<%c echo<<vinfo.get["aa"].to_string(); %>| </h3>
             
         
        
```

echo<<vinfo.get\["aa"\].to\_string();

This is the view tag C++code included in <%c %>

echo is a buffer, which is assembled together with the external HTML

Convert to C++ code

It's like this

```

        echo<<"Nav test |";
        echo<<vinfo.get["aa"].to_string();
        echo<<"| </h3>";
         
```

You can refer to the `viewsrc/view/home/head.cpp` code for details.

#### 3、 Compile view to cpp file

Run in the root directory of the website

./bin/paozhu\_cli

Select 'f' to generate files

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

We input f and compile it directly with the framework.

Then enter a, and all modified or newly created view files will be converted to cpp files

The file is saved in the viewsrc directory

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

Probably like this

The login.html header.html files have been converted to cpp files

Two files in the include directory

Viewsrc.h is the definition of all view file functions

regviewmethod.hpp is a view registration function that the framework calls to register with the framework

#### Content of viewsrc.h file

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

You can see that the views are all placed in the namespace, so there is no conflict between the view files in one directory and those in other directories with the same name.

#### regviewmethod.hpp registration function file content

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

Two functions are registered on the callback function, which means a view file is a function

Directory name and file name form a registration point

Login/login is a registration point

Controller peer->view("login/login"); calling method.

#### 4、 View testing

We have created the view, now let's test it

Follow the introductory chapter of Hello World

`controller/src`Directory create `testview.cpp` file

Probably like this

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
                    client << " view test ";
                    // client << client.gethosturl();
                    // client<<"<p><a href=\""<<client.gethosturl()<<"/showcookie\">show</a></p>";
        
                    peer->view("login/login");
                    return "";
              }
        
        }
        
        
```

Map testview to testloginview function, the two names can be different.

`http://localhost/testview` You can access our testloginview function

#### 5、Compile

Everything is ready, let's start compiling

Return to the project root directory and enter the build directory

cmake ..

make

Then go back to the root directory or open a new Terminal Command

cd ..

./bin/paozhu #In Linux use: sudo ./bin/paozhu

Open with a browser

http://localhost/testview

You can see the content of the view now

### JSON and struct conversion function json\_encode json\_decode

The framework has built-in structure and JSON conversion functions, reducing the workload of writing code

#### Usage

The framework provides two function operations `json_encode` `json_decode` that can be on structures or class objects、

std::string json\_encode(obj)

std::string json\_encode(std::vector<obj>)

Encoding objects as JSON supports arrays or objects

int json\_decode(obj,json\_string)

int json\_decode(std::vector<obj>,json\_string)

Decoding JSON strings to objects

#### Theory

`common/json_reflect_headers.h` It is the header file referenced by all reflection objects

This file was generated by`paozhu_cli`

You need to create the corresponding type file in the libs directory, and then run paozhu\_cli to generate it. The framework directly analyzes the type file to generate the corresponding code. Currently, it supports commonly used structures, which can be nested in multiple layers or reference structures that are also reflective.

#### Example of use

Create test file `libs/department/department_type.h`

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

`//@reflect json` It is a framework analysis source code extraction flag, which must be a struct or class starting with this, otherwise it will not work.

We create two structures, with one nested within the other, to facilitate business code operations. to\_json from\_json is a testing framework that analyzes whether the source code correctly skips these functions

Variables starting with an underscore will not be output to a JSON string

#### Generate entity code for the object `json_encode` and `json_decode`

```

            sudo ./bin/paozhu_cli
            
```
```

            ./bin/paozhu_cli  model | view | viewtocpp | control   
            🎉 Welcome to use cli to manage your MVC files。
            (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
            
```

Input j

You can see the generated file now

```

            1 /Users/hzq/paozhu/libs/department/department_type_jsonreflect.cpp
            (m)model (v)view (f)viewtocpp or (c)control , (j)son ,x or q to exit[input m|v|f|c|j|]:
            
```

#### json\_encode json\_decode Example of use

Reference `controller/src/testjsonreflect.cpp`

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
                deps_json_one.title       = "First Item";
                deps_json_one.desc        = "First Item";
                deps_json_one.bianzhi_num = 12;
    
                depsjsonlist.push_back(deps_json_one);
    
                deps_json_one.id          = 48;
                deps_json_one.key         = 48;
                deps_json_one.value       = 48;
                deps_json_one.parentid    = 0;
                deps_json_one.isopen      = true;
                deps_json_one.title       = "Second Item";
                deps_json_one.desc        = "Second memo";
                deps_json_one.bianzhi_num = 16;
    
                depsjsonlist.push_back(deps_json_one);
    
                deps_json_one.id          = 58;
                deps_json_one.key         = 58;
                deps_json_one.value       = 58;
                deps_json_one.parentid    = 48;
                deps_json_one.isopen      = true;
                deps_json_one.title       = "Three Item";
                deps_json_one.desc        = "Three memo";
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

We first convert the array into a tree, and then encode the test object into a JSON string

std::string jsondep\_str = psy::json\_encode(depout\_data);

Then decode the jsondep\_str variable to the new object

`psy::json_decode(new_depout_data, jsondep_str);`

And then we'll do it again `std::string jsondep_str_temp = psy::json_encode(new_depout_data);`

Then output jsondep\_str\_temp, See if it meets our expectations

### HttpClient Introduction

Example file `controller/src/testcowaitclient.cpp`

This is the synchronous usage method

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

This is the Coroutine usage method

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

the Coroutine use `async_` prefix.

  

### Troubleshooting in C++ Production Environment

The framework has enabled ASAN, and if it is detected by ASAN during debugging, it will indicate which line is problematic.

The production environment is difficult to see due to the lack of output reasons.

The compilation parameters for the production environment.

```

        mkdir build
        cd build
        cmake .. -DCMAKE_BUILD_TYPE=Release #OR cmake .. -DCMAKE_BUILD_TYPE=Release -DENABLE_GD=ON
        make -j8
        
```

Need to install `gdb` and `coredumpctl`

The framework will be checked every minute, at `log` directory have a `restart_server` file

If we need to retrieve a sample of the process stack, we can `touch log/start_Server` so that the process can restart

have access to `pstree -aup` view process status

If the sample has already been taken, I need to analyze the process stack situation

view coredump info

```

        coredumpctl list
        coredumpctl info
        
```

Looking directly online 1524 pid, That's what I saw before`pstree up`

```
coredumpctl gdb 1524
```

`bt` can be view it

After entering, we can save it and view it in the current`thread_info.txt`file.

```

        set logging file thread_info.txt
        set logging enabled on
        thread apply all bt
        set logging enabled off
        
```

The core coredump file is usually located in

```
/var/lib/systemd/coredump
```

If compiled using -g, you will see something similar to the following, usually displaying what various threads are currently doing

```
Thread 17 (Thread 0x7fd9f16b9640 (LWP 10658)):
                  #0  http::hash_objkey (key=&quot;data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2My&quot;...) at /www/paozhu/vendor/httpserver/src/request.cpp:54
                  #1  0x000000000060032f in http::obj_val::operator[] (this=0x7fd9cc01e520, key=&quot;data:image/php;base64,PD9waHAgJE8wME9PMD11cmxkZWNvZGUoIiU3OCUzNCU2MyU2RiUyRiU3MCUzOSU3OSU3MSU2RSU2NCUyRCU2QyU3MiU2QiU2NCU2NyU1RiU&quot;...) at /www/paozhu/vendor/httpserver/src/request.cpp:315
                  #2  0x00000000005a990c in http::httpparse::procssxformurlencoded (this=0x7fd9b400d370) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:389
                  #3  0x00000000005b1bfa in http::httpparse::process (this=0x7fd9b400d370, buffer=0x2e223c0 &quot;POST /public/static/lib/webuploader/0.1.5/server/preview.php HTTP/1.1\r\nHost: www. paozhu.org\r\nUser-Agent: Mozilla/5.0 AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0\r\nAccept-Encoding: gzip, deflate&quot;..., buffersize=964) at /www/paozhu/vendor/httpserver/src/http_parse.cpp:2823
                  
        
```

[Reference to CMakeLists.txt](CMakeLists_debug_product.txt)