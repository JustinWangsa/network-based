create table company_t(
    id      int AUTO_INCREMENT key,
    name    varchar(1024) unique
);    
create table user_t(
    company_id  int references company_t (id),
    isManager   bool ,
    name        varchar(1024), -- suppose to be unique, but cause virtual bug
    password    binary(40), -- sha1 is 160 bit, but this is hexed so 320 bit
    primary key (company_id,isManager)
);
create table item_t(
    id      int AUTO_INCREMENT Key,
    company_id int references company_t (id),
    type    varchar(256),
    name    varchar(256),
    image   longblob default null,
    currentStock   int
    
);
create table stock_t(
    company_id int references company_t (id),
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict 
    stock    int,
    price   int,

    primary key (company_id,time,item_id)
);
create table transaction_t(
    company_id int references company_t (id),
    time    datetime, -- [YYYY-MM-DD hh:mm:ss]
    item_id int references item_t (id), -- on delete restrict
    count   int,

    primary key (company_id,time,item_id)
);