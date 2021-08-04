
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


--CREATE ar_internal_metadata table: 
CREATE Table ar_internal_metadata(
  key varchar PRIMARY KEY not null,
  value varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON ar_internal_metadata
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--secuence users table: 

--table:
CREATE TABLE users(
  id varchar PRIMARY KEY not null,
  email varchar not null default '',
  remember_created_at TIMESTAMP, 
  user_type varchar,
  first_name varchar,
  last_name varchar,
  full_name varchar,
  avatar varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  country_code integer,
  time_zone varchar,
  provider varchar,
  unseen_notifications integer default 0,
  language integer default 0
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
CREATE SEQUENCE users_id_seq OWNED BY users.id;
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

CREATE INDEX "index_users_on_email" on users(email);

alter table users  add constraint UQ_users_email  unique (email);

--authetications table: 
CREATE TABLE authentications_users(
  id varchar PRIMARY KEY not null,
  user_id varchar,
  encrypted_password varchar not null default '',
  email varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY(user_id)
     REFERENCES users(id)
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON authentications_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--SEQUENCES authentications_users table: 
CREATE SEQUENCE authentications_users_id_seq OWNED BY authentications_users.id;
ALTER TABLE authentications_users ALTER COLUMN id SET DEFAULT nextval('authentications_users_id_seq'::regclass);


--INDEXING authentications_users table: 
--CREATE INDEX "authentications_pkey" on authentications_users(id);
CREATE INDEX "index_authentications_users_on_user_id" on authentications_users(user_id);



 CREATE TABLE admins(  
   id varchar PRIMARY KEY not null,
   admin_type varchar,
   first_name varchar,
   last_name varchar,
   phone_number varchar default '',
   full_name varchar,
   avatar varchar,
   email varchar,
   time_zone varchar,
   country_code integer,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );

 CREATE TRIGGER set_timestamp
 BEFORE UPDATE ON admins
 FOR EACH ROW
 EXECUTE PROCEDURE trigger_set_timestamp();

 CREATE SEQUENCE admins_id_seq OWNED BY admins.id;
 ALTER TABLE admins ALTER COLUMN id SET DEFAULT nextval('admins_id_seq'::regclass);
alter table admins  add constraint UQ_admins_email  unique (email);



--authetications table: 
CREATE TABLE authentications_admins(
  id varchar PRIMARY KEY not null,
  admin_id varchar,
  uid varchar,
  encrypted_password varchar not null default '',
  provider varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY(admin_id)
     REFERENCES admins(id)
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON authentications_admins
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE authentications_admins_id_seq OWNED BY authentications_admins.id;
ALTER TABLE authentications_admins ALTER COLUMN id SET DEFAULT nextval('authentications_admins_id_seq'::regclass);

CREATE INDEX "index_authentications_admins_on_user_id" on authentications_admins(admin_id);


CREATE TABLE channelchats(
  id varchar PRIMARY KEY not null,
  channel_name varchar,
  user_id varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
    FOREIGN KEY(user_id)
     REFERENCES users(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON channelchats
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


--CREATE SEQUENCE FOR EVENTS TABLE: 
CREATE SEQUENCE channelchats_id_seq OWNED BY channelchats.id;
ALTER TABLE channelchats ALTER COLUMN id SET DEFAULT nextval('channelchats_id_seq'::regclass);
--Indexings for events Table: 
CREATE INDEX "index_channelchats_on_deleted_at" on channelchats(deleted_at);
CREATE INDEX "index_channelchats_on_user_id" on channelchats(user_id);

CREATE TABLE messages(
  id varchar PRIMARY KEY not null,
  user_id varchar not null,
  channel_id varchar not null,
  full_name varchar not null,
  message text, 
  file varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  FOREIGN KEY(user_id)
     REFERENCES users(id),
  FOREIGN KEY(channel_id)
     REFERENCES channelchats(id) 
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE messages_id_seq OWNED BY messages.id;
ALTER TABLE messages ALTER COLUMN id SET DEFAULT nextval('messages_id_seq'::regclass);

CREATE INDEX "index_messages_on_deleted_at" on messages(deleted_at);
CREATE INDEX "index_messages_on_channelchats_id" on messages(channel_id);
CREATE INDEX "index_messages_on_user_id" on messages(user_id);



CREATE TABLE usersreaded(
  id varchar PRIMARY KEY not null,
  user_id varchar NOT NULL,
  msg_id  varchar NOT NULL,
  channel_id varchar NOT NULL,
  readed boolean NOT NULL,
  date_readed TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
   FOREIGN KEY(msg_id)
    REFERENCES messages(id),
   FOREIGN KEY(channel_id)
    REFERENCES channelchats(id),
   FOREIGN KEY(user_id)
    REFERENCES users(id)
  );
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON usersreaded
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE SEQUENCE usersreaded_id_seq OWNED BY usersreaded.id;
ALTER TABLE usersreaded ALTER COLUMN id SET DEFAULT nextval('usersreaded_id_seq'::regclass);
--Indexings for events Table: 
CREATE INDEX "index_usersreaded_on_users_id" on usersreaded(user_id);
CREATE INDEX "index_usersreaded_on_messages_id" on usersreaded(msg_id);
CREATE INDEX "index_usersreaded_on_channelchats_id" on usersreaded(channel_id);


CREATE TABLE categories(
  id varchar PRIMARY KEY not null,
  name varchar not null,
  description varchar,
  quantity varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--CREATE SEQUENCE FOR EVENTS TABLE: 
CREATE SEQUENCE categories_id_seq OWNED BY categories.id;
ALTER TABLE categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);



--CREATE TABLE FOR PRODUCTS TABLE: 
CREATE TABLE products(
  id varchar PRIMARY KEY not null,
  user_id varchar,   --for default this id is one admin of this event.
  name varchar not null,
  product_type integer not null,
  category_id varchar not null,
  price varchar not null,
  description varchar,
  company varchar not null,
  author varchar,
  quantity varchar not null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  stage boolean,
  deleted_at TIMESTAMP,
  FOREIGN KEY(user_id) 
    REFERENCES users(id),
  FOREIGN KEY (category_id)
    REFERENCES categories(id)
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


--CREATE SEQUENCE FOR products TABLE: 
CREATE SEQUENCE products_id_seq OWNED BY products.id;
ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);
--Indexings for products Table: 
CREATE INDEX "index_products_on_deleted_at" on products(deleted_at);
CREATE INDEX "index_products_on_user_id" on products(user_id);


CREATE TABLE orders(
  id varchar PRIMARY KEY not null,
  user_id varchar not null,  
  product_id varchar not null,
  stage_ative boolean,
  stage_buy boolean default false,
  deleted_at TIMESTAMP,
   FOREIGN KEY(user_id)
    REFERENCES users(id),
   FOREIGN KEY(product_id)
    REFERENCES products(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--CREATE SEQUENCE FOR products TABLE: 
CREATE SEQUENCE orders_id_seq OWNED BY orders.id;
ALTER TABLE orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq'::regclass);
--Indexings for orders Table: 
CREATE INDEX "index_orders_on_deleted_at" on orders(deleted_at);
CREATE INDEX "index_orders_on_user_id" on orders(user_id);


CREATE TABLE notifications(
  id varchar PRIMARY KEY not null ,
  message varchar not null,
  notificable_id integer not null,
  notificable_type varchar not null,
  user_id varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  readed boolean default false,
  reason integer,
  FOREIGN KEY(user_id) 
    REFERENCES users(id) 
);
-- --CREATE SEQUENCE FOR notifications table: 
 CREATE TRIGGER set_timestamp
 BEFORE UPDATE ON notifications
 FOR EACH ROW
 EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE SEQUENCE notifications_id_seq OWNED BY notifications.id;
  ALTER TABLE notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);

--CREATE INDEXINGS FOR notifications table: 
CREATE INDEX "index_notifications_on_user_id" on notifications(user_id);


--CREATE devices TABLE:
CREATE TABLE devices(
    id varchar PRIMARY KEY not null,
    token varchar not null,
    identifier varchar not null,
    player_id varchar not null,
    os integer not null,
    user_id varchar,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id) 
      REFERENCES users(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON devices
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE devices_id_seq OWNED BY devices.id;
ALTER TABLE devices ALTER COLUMN id SET DEFAULT nextval('devices_id_seq'::regclass);

CREATE INDEX "index_devices_on_user_id" on devices(user_id);

