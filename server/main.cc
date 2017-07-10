#include "main.h"
using namespace std;
using namespace httplib;
int main(int argc, char* argv[]) {
    pthread_t svrThread;
    pthread_create(&svrThread, NULL, startServer, NULL);
    pthread_join(svrThread, NULL);
    return 0;
};