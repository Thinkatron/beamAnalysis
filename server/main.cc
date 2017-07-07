#include "main.h"
using namespace std;
using namespace httplib;
int main(int argc, char* argv[]) {

    Server svr;
    
    svr.get("/*", [](const Request& req, Response& res) {
        string path = req.path;
        if (path.length() > 0) path = path.substr(1, path.length());
        cout << "Old path:\t" << path << "\n";
        if (path == "") path = "index.html";
        cout << "New path:\t" << path << "\n";
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
    svr.listen("localhost", 80);
    return 0;
};