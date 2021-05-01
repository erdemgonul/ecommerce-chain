import 'package:flutter/cupertino.dart';

class ColorFilters {
  String text;
  String value;

  ColorFilters({
    @required this.text,
    @required this.value,
  });

  ColorFilters.fromJson(Map<String, dynamic> json)
      : text = json['text'],
        value = json['value'];
  Map<String, dynamic> toJson() =>
      {
        'text': text,
        'value': value
      };
}