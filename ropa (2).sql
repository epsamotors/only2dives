/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     20/10/2021 10:57:53                          */
/*==============================================================*/


drop table if exists CALIFICACION;

drop table if exists CATEGORIA;

drop table if exists COLOR;

drop table if exists COMENTARIO;

drop table if exists DESCUENTO;

drop table if exists DETALLE_VENTA;

drop table if exists DIRECCION;

drop table if exists GALERIA;

drop table if exists PERSONA;

drop table if exists PRODUCTO;

drop table if exists ROL;

drop table if exists SLIDER;

drop table if exists TALLA;

drop table if exists VENTA;

/*==============================================================*/
/* Table: CALIFICACION                                          */
/*==============================================================*/
create table CALIFICACION
(
   CALIFICACION_ID      int not null AUTO_INCREMENT,
   PRODUCTO_ID          int,
   CALIFICACION_NOMBRE  char(200) not null,
   COMENTARIO_ESTADO    char(20) not null,
   primary key (CALIFICACION_ID)
);

/*==============================================================*/
/* Table: CATEGORIA                                             */
/*==============================================================*/
create table CATEGORIA
(
   CATEGORIA_ID         int not null AUTO_INCREMENT,
   CATEGORIA_NOMBRE     char(60) not null,
   CATEGORIA_DESCRIPCION char(200),
   CATEGORIA_ESTADO     char(20) not null,
   primary key (CATEGORIA_ID)
);

/*==============================================================*/
/* Table: COLOR                                                 */
/*==============================================================*/
create table COLOR
(
   COLOR_ID             int not null AUTO_INCREMENT,
   PRODUCTO_ID          int,
   COLOR_CODIGO         int,
   COLOR_ESTADO         char(20) not null,
   primary key (COLOR_ID)
);

/*==============================================================*/
/* Table: COMENTARIO                                            */
/*==============================================================*/
create table COMENTARIO
(
   COMENTARIO_ID        int not null AUTO_INCREMENT,
   PRODUCTO_ID          int not null,
   PERSONA_ID           int not null,
   COMENTARIO_DESCRIPCION char(200) not null,
   COMENTARIO_CALIFICACION decimal(5,2),
   COMENTARIO_ESTADO    char(20) not null,
   primary key (COMENTARIO_ID)
);

/*==============================================================*/
/* Table: DESCUENTO                                             */
/*==============================================================*/
create table DESCUENTO
(
   DESCUENTO_ID         int not null AUTO_INCREMENT,
   PRODUCTO_ID          int,
   DESCUENTO_NOMBRE     int not null,
   DESCUENTO_ESTADO     char(20) not null,
   primary key (DESCUENTO_ID)
);

/*==============================================================*/
/* Table: DETALLE_VENTA                                         */
/*==============================================================*/
create table DETALLE_VENTA
(
   DETALLEVENTA_ID      int not null AUTO_INCREMENT,
   VENTA_ID             int,
   PRODUCTO_ID          int,
   DETALLEVENTA_CANTIDAD int,
   DETALLEVENTA_PRECIOUNITARIO int,
   DETALLEVENTA_DESCUENTO int,
   DETALLEVENTA_TOTAL   int,
   primary key (DETALLEVENTA_ID)
);

/*==============================================================*/
/* Table: DIRECCION                                             */
/*==============================================================*/
create table DIRECCION
(
   DIRECCION_ID         int not null AUTO_INCREMENT,
   PROVINCIA            char(60) not null,
   CIUDAD               char(60) not null,
   primary key (DIRECCION_ID)
);

/*==============================================================*/
/* Table: GALERIA                                               */
/*==============================================================*/
create table GALERIA
(
   GALERIA_ID           int not null AUTO_INCREMENT,
   PRODUCTO_ID          int,
   GALERIA_NOMBRE       char(60),
   GALERIA_DESCRIPCION  char(200),
   GALERIA_URL          char(200) not null,
   GALERIA_ESTADO       char(200) not null,
   primary key (GALERIA_ID)
);

/*==============================================================*/
/* Table: PERSONA                                               */
/*==============================================================*/
create table PERSONA
(
   PERSONA_ID           int not null AUTO_INCREMENT,
   ROL_ID               int not null,
   DIRECCION_ID         int,
   PERSONA_APELLIDO     char(60),
   PERSONA_NOMBRE       char(60),
   PERSONA_NACIONALIDAD char(10),
   PERSONA_DNI          char(10),
   PERSONA_TELEFONO     char(10),
   PERSONA_DIRECCION    char(60),
   PERSONA_CORREO       char(60),
   PERSONA_CONTRASENA   char(60),
   PERSONA_ESTADO       char(20),
   primary key (PERSONA_ID)
);

/*==============================================================*/
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO
(
   PRODUCTO_ID          int not null AUTO_INCREMENT,
   CATEGORIA_ID         int,
   TALLA_ID             int,
   PRODUCTO_NOMBRE      char(60) not null,
   PRODUCTO_CODIGO	char(20),
   PRODUCTO_MEDIDAS	text,
   PRODUCTO_DESCRIPCION text,
   PRODUCTO_PRECIO      int not null,
   PRODUCTO_STOCK	int not null,
   PRODUCTO_FECHAALTA   date not null,
   PRODUCTO_FECHABAJA   date,
   PRODUCTO_URL         char(200) not null,
   PRODUCTO_ESTADO      char(20) not null,
   primary key (PRODUCTO_ID)
);

/*==============================================================*/
/* Table: ROL                                                   */
/*==============================================================*/
create table ROL
(
   ROL_ID               int not null AUTO_INCREMENT,
   ROL_NOMBRE           char(20) not null,
   ROL_ESTADO           char(20) not null,
   primary key (ROL_ID)
);

/*==============================================================*/
/* Table: SLIDER                                                */
/*==============================================================*/
create table SLIDER
(
   SLIDER_ID            int not null AUTO_INCREMENT,
   SLIDER_URL           char(200) not null,
   SLIDER_ESTADO        char(20) not null,
   primary key (SLIDER_ID)
);

/*==============================================================*/
/* Table: TALLA                                                 */
/*==============================================================*/
create table TALLA
(
   TALLA_ID             int not null AUTO_INCREMENT,
   TALLA_TIPO           char(20) not null,
   TALLA_NOMBRE         char(20) not null,
   TALLA_ESTADO         char(20) not null,
   primary key (TALLA_ID)
);

/*==============================================================*/
/* Table: VENTA                                                 */
/*==============================================================*/
create table VENTA
(
   VENTA_ID             int not null AUTO_INCREMENT,
   PERSONA_ID           int not null,
   VENTA_TOTAL          decimal(6,2) not null,
   VENTA_FECHA          date not null,
   VENTA_ESTADO         char(20) not null,
   primary key (VENTA_ID)
);

alter table CALIFICACION add constraint FK_RELATIONSHIP_15 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table COLOR add constraint FK_RELATIONSHIP_14 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table COMENTARIO add constraint FK_RELATIONSHIP_8 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table COMENTARIO add constraint FK_RELATIONSHIP_9 foreign key (PERSONA_ID)
      references PERSONA (PERSONA_ID) on delete restrict on update restrict;

alter table DESCUENTO add constraint FK_RELATIONSHIP_11 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table DETALLE_VENTA add constraint FK_RELATIONSHIP_3 foreign key (VENTA_ID)
      references VENTA (VENTA_ID) on delete restrict on update restrict;

alter table DETALLE_VENTA add constraint FK_RELATIONSHIP_4 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table GALERIA add constraint FK_RELATIONSHIP_5 foreign key (PRODUCTO_ID)
      references PRODUCTO (PRODUCTO_ID) on delete restrict on update restrict;

alter table PERSONA add constraint FK_RELATIONSHIP_13 foreign key (DIRECCION_ID)
      references DIRECCION (DIRECCION_ID) on delete restrict on update restrict;

alter table PERSONA add constraint FK_RELATIONSHIP_7 foreign key (ROL_ID)
      references ROL (ROL_ID) on delete restrict on update restrict;

alter table PRODUCTO add constraint FK_RELATIONSHIP_12 foreign key (CATEGORIA_ID)
      references CATEGORIA (CATEGORIA_ID) on delete restrict on update restrict;

alter table PRODUCTO add constraint FK_RELATIONSHIP_17 foreign key (TALLA_ID)
      references TALLA (TALLA_ID) on delete restrict on update restrict;

alter table VENTA add constraint FK_RELATIONSHIP_2 foreign key (PERSONA_ID)
      references PERSONA (PERSONA_ID) on delete restrict on update restrict;

