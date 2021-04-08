import 'package:flutter/material.dart';


class CartItemWidget extends StatelessWidget {
  final String id;
  final String productId;
  final double price;
  final int quantity;
  final String title;

  CartItemWidget(this.id, this.productId, this.price, this.quantity, this.title);

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Theme.of(context).errorColor,
        child: Icon(
          Icons.delete,
          color: Colors.white,
          size: 30,
        ),
        alignment: Alignment.centerRight,
        padding: EdgeInsets.only(right: 20),
        margin: EdgeInsets.symmetric(horizontal: 15, vertical: 4),
      ),
      confirmDismiss: (direction) {
        return showDialog(
          context: context,
          builder: (innerContext) => AlertDialog(
            title: Text('Are you sure!'),
            content: Text('Do you want to remove the cart item?'),
            actions: <Widget>[
              FlatButton(child: Text('No'), onPressed: (){
                Navigator.of(innerContext).pop(false);
              },),
              FlatButton(child: Text("Yes"), onPressed: (){
                Navigator.of(innerContext).pop(true);
              },)
            ],
          ),
        );
      },
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 15, vertical: 4),
        child: Padding(
          padding: EdgeInsets.all(8),
          child: ListTile(

            title: Text(title),
            subtitle: Text("Total: \$${(price * quantity)} "),
            trailing: Text("$quantity x $price TL"),

          ),
        ),
      ),
    );
  }
}