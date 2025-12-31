# for combining every module
```bash
#cloning repo
git clone 'https://github.com/JustinWangsa/network-based.git' -b Server server;
git clone 'https://github.com/JustinWangsa/network-based.git' -b Desktop client_desktop;
git clone 'https://github.com/JustinWangsa/cashier-network-based.git' -b main client_browser;


 
# installing dependency
cd server/server; 
npm install; 
cd ../..; 

cd client_desktop/client_desktop; 
npm install; 
cd ../..; 

# create a database according to server repo's readme. the file to create the table are in 
# /server/init/createTable.sql
```



'D:\tugas\3_1\NetworkApp\Final\simulation\server\client_browser\src\views\Cashier\cashier.html'
'D:\tugas\3_1\NetworkApp\Final\simulation\client_browser\src\views\Cashier\cashier.html