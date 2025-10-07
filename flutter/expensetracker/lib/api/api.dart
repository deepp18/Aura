import 'dart:collection';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';
import 'package:mobile/main.dart';
import 'package:toastification/toastification.dart';

class Api {
  static var BASE_URL = 'https://js04vgc7-5001.inc1.devtunnels.ms';
  var dio = Dio(BaseOptions(
      validateStatus: (status) {
        if (status != null && (status <= 404 || status == 500)) {
          return true;
        }
        return false;
      },
      contentType: 'application/json',
      baseUrl: BASE_URL));
  static var GET_EXPENSES = "$BASE_URL/api/user/get-expense";
  static var ADD_EXPENSE = "$BASE_URL/api/user/add-expense";
  static var DELETE_EXPENSE = "$BASE_URL/api/user/delete-expense";

  static Future<Response?> getExpenses() async {
    try {
      var response = await dio.post(GET_EXPENSES, data: {
        "email": "sonarsiddhesh105@gmail.com",
      });
      print('respnse - ');
      print(response.data);
      return response;
    } catch (e) {
      print("Error occured - ");
      print(e);
      return null;
    }
  }
}