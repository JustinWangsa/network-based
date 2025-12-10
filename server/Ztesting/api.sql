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

-- select * 
-- from (
--     select 
--         t.time as ttime,
--         t.item_id,
--         t.count,
--         s.time as stime,
--         s.price,
--         dense_rank() over(
--             partition by ttime,item_id
--             order by stime desc
--         ) as rank
--     from (
--         select * from transaction_t
--         where company_id = 1
--     ) as t
--     join (
--         select * from stock_t
--     ) as s 
--     on 
--         t.company_id = s.company_id and
--         t.item_id = s.item_id and
--         t.time >= s.time
--     order by ttime
-- ) as q
-- where q.rank = 1
-- ;

set @company_id = 1;

-- company transaction
-- select * from transaction_t
-- where company_id = @company_id
-- ;


-- company price history
-- select 
--     time,
--     item_id,
--     price
-- from stock_t
-- where company_id = @company_id
-- ;


-- join transaction and price 
-- select 
--     t.time as ttime,
--     t.item_id,
--     t.count,
--     s.time as stime,
--     s.price,
--     dense_rank() over (
--         partition by ttime,item_id
--         order by stime desc
--     ) as rank
-- from (
--     select 
--         time,
--         item_id,
--         count
--     from transaction_t 
--     where company_id = @company_id
-- ) as t
-- join (
--     select 
--         time,
--         item_id,
--         price
--     from stock_t
--     where company_id = @company_id
-- ) as s
-- on 
--     s.item_id = t.item_id and
--     s.time <= t.time 
-- order by ttime

-- only rank 1
select 
    ttime as time,
    item_id,
    count,
    price
from (
    select 
        t.time as ttime,
        t.item_id,
        t.count,
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
    ) as s
    on 
        s.item_id = t.item_id and
        s.time <= t.time 
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


