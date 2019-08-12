#include <iostream>
#include <pthread.h>
#include <atomic>
#include "httplib.h"
using namespace std;
using namespace httplib;

void addFileListener(Server* svr) {
    svr->get(R"(/(.*))", [](const Request& req, Response& res) {
        string path = req.matches[1];
        //if (path.length() > 0) path = path.substr(1, path.length());
        cout << "Old path:\t" << path << "\n";
        if (path == "") path = "index.html";
        cout << "New path:\t" << path << "\n";
        path = "../client/" + path;
        ifstream read(path);
        string str;
        string file;
        while (getline(read, str)) {
            file += str;
        }
        const string nFile = file;
        string fileEnding = path.substr(path.find_last_of('.') + 1, path.length() - 1);
        if (fileEnding == "htm" || fileEnding == "html" ) {
            res.set_content(nFile, (const char*)"text/html");
        } else if (fileEnding == "js") {
            res.set_content(nFile, (const char*)"application/javascript");
        } else if (fileEnding == "css") {
            res.set_content(nFile, (const char*)"text/css");
        }
    });
}

void addPostHandler(Server* svr) {
    svr->post(("/", [](const Request& req, Response& res) {
        string path = req.matches[1];
        //if (path.length() > 0) path = path.substr(1, path.length());
        cout << "Old path:\t" << path << "\n";
        if (path == "") path = "index.html";
        cout << "New path:\t" << path << "\n";
        path = "../client/" + path;
        ifstream read(path);
        string str;
        string file;
        while (getline(read, str)) {
            file += str;
        }
        const string nFile = file;
        string fileEnding = path.substr(path.find_last_of('.') + 1, path.length() - 1);
        if (fileEnding == "htm" || fileEnding == "html" ) {
            res.set_content(nFile, (const char*)"text/html");
        } else if (fileEnding == "js") {
            res.set_content(nFile, (const char*)"application/javascript");
        } else if (fileEnding == "css") {
            res.set_content(nFile, (const char*)"text/css");
        }
    });
    return 0;
}

void* startServer(void*) {
    Server* svr = new Server;
    addFileListener(svr);
    svr->listen("localhost", 80);
    return 0;
}

