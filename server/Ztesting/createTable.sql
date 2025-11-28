


use test_db;

drop table if exists stock_t ;
drop table if exists transaction_t ;
drop table if exists user_t ;
drop table if exists item_t ;

create table user_t(
    id          int AUTO_INCREMENT key,
    name        varchar(1024) unique, -- name of the company
    password    binary(60), -- bcrypt.hashSync($password, 10)
    isManager   bool
);

create table item_t(
    id      int AUTO_INCREMENT key,
    name    varchar(256),
    price   int,
    image   blob(65535) default null
);

create table transaction_t(
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict
    count   int,

    primary key (time,item_id)
);

create table stock_t(
    date    date, -- [YYYY-MM-DD]
    item_id int references item_t (id), -- on delete restrict 
    stock   int,

    primary key (date,item_id)
);

show tables;
-- mariadb -uroot -proot -t < D:/tugas/3_1/NetworkApp/Final2/Server/server/Ztesting/createTable.sql