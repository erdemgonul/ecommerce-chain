import 'package:flutter/material.dart';

class Product {
   String sku, image, title, description;
   int price, size, quantity;
   Color color;
   Map<String,dynamic> shipping_details;
   Map<String,dynamic> product_details;
  Product({
    this.sku,
    this.image,
    this.title,
    this.price,
    this.description,
    this.size,
    this.color,
    this.quantity,
    this.product_details,
    this.shipping_details,
  });

   Product.fromJson(Map<String, dynamic> json)
       : sku = json['sku'],
         image = json['image'],
         title = json['title'],
         price= json['price'],
         description = json['description'],
         size = json['size'],
         color= json['color'],
         quantity = json['quantity'],
         product_details = json['product_details'],
         shipping_details = json['shipping_details'];

   Map<String, dynamic> toJson() =>
       {
         'sku': sku,
         'image': image,
         'title':title,
         'price' : price,
         'description':description,
         'size':size,
         'color' : color,
         'quantity' :quantity,
         'product_details':product_details,
         'shipping_details':shipping_details
       };
}

/*List<Product> products = [
  Product(
      id: 1,
      title: "Office Code",
      price: 234,
      size: 12,
      description: dummyText,
      image: "assets/images/bag_1.png",
      color: Color(0xFF3D82AE)),
  Product(
      id: 2,
      title: "Belt Bag",
      price: 234,
      size: 8,
      description: dummyText,
      image: "assets/images/bag_2.png",
      color: Color(0xFFD3A984)),
  Product(
      id: 3,
      title: "Hang Top",
      price: 234,
      size: 10,
      description: dummyText,
      image: "assets/images/bag_3.png",
      color: Color(0xFF989493)),
  Product(
      id: 4,
      title: "Old Fashion",
      price: 234,
      size: 11,
      description: dummyText,
      image: "assets/images/bag_4.png",
      color: Color(0xFFE6B398)),
  Product(
      id: 5,
      title: "Office Code",
      price: 234,
      size: 12,
      description: dummyText,
      image: "assets/images/bag_5.png",
      color: Color(0xFFFB7883)),
  Product(
    id: 6,
    title: "Office Code",
    price: 234,
    size: 12,
    description: dummyText,
    image: "assets/images/bag_6.png",
    color: Color(0xFFAEAEAE),
  ),
];*/

String dummyText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. When an unknown printer took a galley.";