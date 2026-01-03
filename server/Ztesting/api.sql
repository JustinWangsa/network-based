use test_db;
select "result"\G;
show tables;

desc company_t;
desc user_t;
desc item_t;
desc stock_t;
desc transaction_t;
-- ---------------data generation---------------------------


select "------------specific code-------------" \G;

set @company_id = 1;

select 
    ttime as time,
    item_id,
    name,
    count,
    price
from (
    select 
        t.time as ttime,
        t.item_id,
        t.count,
        i.name,
        s.time as stime,
        s.price,
        dense_rank() over (
            partition by ttime,item_id
            order by stime desc
        ) as rank
    from (
        select 
            time,
            item_id,
            count
        from transaction_t 
        where company_id = @company_id
    ) as t
    join (
        select 
            time,
            item_id,
            price
        from stock_t
        where company_id = @company_id
    ) as s on 
        t.item_id = s.item_id and
        t.time >= s.time 
    join item_t i on 
        t.item_id = i.id 
    order by ttime
) as t
where rank = 1
;

select "---------------data Dump-------------" \G;
select 
    id as _company_id,
    name

from company_t;
select
    name as _user_name,
    company_id,
    isManager,
    LEFT(password,10)
from user_t;
select 
    id as _item_id,
    company_id,
    name,
    currentStock,
    expiry,
    LEFT(Hex(image),20)
from item_t;
select
    time as _transaction_time,
    company_id,
    item_id,
    count
    
from transaction_t;
select
    time as _stock_time,
    company_id,
    item_id,
    price,
    stock
from stock_t;
    


--------- /stock_page/update_limitation


--------- /transaction_page/cart_page


--------- /transaction_page/post_transaction
--------- /transaction_page/fetch_transaction_history
--------- /navigation/export
--------- /summary_page/high_level
--------- /summary_page/log

-- insert into company_t (name) values ("the Company");
-- insert into user_t values (1,false,"theCompany_cashier","mypassword");


