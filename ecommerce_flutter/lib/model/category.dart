import 'package:flutter/cupertino.dart';

class Category {
  String title;
  String parent;
  String path;

  Category({
    @required this.title,
    @required this.parent,
    @required this.path,
  });

  Category.fromJson(Map<String, dynamic> json)
      : title = json['title'],
        parent = json['parent'],
        path = json['path'];

  Map<String, dynamic> toJson() =>
      {
        'title': title,
        'parent': parent,
        'path':path
      };
}