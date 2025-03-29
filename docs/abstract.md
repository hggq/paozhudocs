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

### paozhu入门 ###

paozhu支持`MacOS`、`Linux`、`Windows`系统。

依赖第三方开发包

`OpenSSL` `Zlib` `Brotli` `ASIO`

可选第三方包  

`GD` `qrencode`

