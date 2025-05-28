import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/note.dart';

class ApiService {
  // Sử dụng IP của máy tính chạy server
  static const String baseUrl = 'http://192.168.1.4:3000/api'; // Thay đổi IP này thành IP của máy tính của bạn
  
  // Các URL khác cho các môi trường khác nhau
  // static const String baseUrl = 'http://10.0.2.2:3000/api'; // Cho Android Emulator
  // static const String baseUrl = 'http://127.0.0.1:3000/api'; // Cho iOS Simulator

  final http.Client _client = http.Client();
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 1);

  Future<T> _retry<T>(Future<T> Function() operation) async {
    int attempts = 0;
    while (true) {
      try {
        attempts++;
        return await operation();
      } catch (e) {
        if (attempts >= maxRetries) rethrow;
        await Future.delayed(retryDelay * attempts);
      }
    }
  }

  Future<List<Note>> getNotes() async {
    return _retry(() async {
      try {
        final response = await _client.get(Uri.parse('$baseUrl/notes'));
        print('GET /notes - Status: ${response.statusCode}');
        print('Response body: ${response.body}');
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            List<dynamic> jsonList = jsonResponse['data'];
            return jsonList.map((json) => Note.fromJson(json)).toList();
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to load notes');
          }
        } else {
          throw Exception('Failed to load notes: ${response.body}');
        }
      } catch (e) {
        print('Error getting notes: $e');
        throw Exception('Failed to load notes: $e');
      }
    });
  }

  Future<Note> createNote(Note note) async {
    return _retry(() async {
      try {
        final response = await _client.post(
          Uri.parse('$baseUrl/notes'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(note.toJson()),
        );
        print('POST /notes - Status: ${response.statusCode}');
        print('Request body: ${note.toJson()}');
        print('Response body: ${response.body}');
        
        if (response.statusCode == 201) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            return Note.fromJson(jsonResponse['data']);
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to create note');
          }
        } else {
          throw Exception('Failed to create note: ${response.body}');
        }
      } catch (e) {
        print('Error creating note: $e');
        throw Exception('Failed to create note: $e');
      }
    });
  }

  Future<Note> updateNote(Note note) async {
    return _retry(() async {
      try {
        final response = await _client.put(
          Uri.parse('$baseUrl/notes/${note.id}'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(note.toJson()),
        );
        print('PUT /notes/${note.id} - Status: ${response.statusCode}');
        print('Request body: ${note.toJson()}');
        print('Response body: ${response.body}');
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            return Note.fromJson(jsonResponse['data']);
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to update note');
          }
        } else {
          throw Exception('Failed to update note: ${response.body}');
        }
      } catch (e) {
        print('Error updating note: $e');
        throw Exception('Failed to update note: $e');
      }
    });
  }

  Future<void> deleteNote(String id) async {
    return _retry(() async {
      try {
        final response = await _client.delete(Uri.parse('$baseUrl/notes/$id'));
        print('DELETE /notes/$id - Status: ${response.statusCode}');
        print('Response body: ${response.body}');
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] != true) {
            throw Exception(jsonResponse['message'] ?? 'Failed to delete note');
          }
        } else {
          throw Exception('Failed to delete note: ${response.body}');
        }
      } catch (e) {
        print('Error deleting note: $e');
        throw Exception('Failed to delete note: $e');
      }
    });
  }

  Future<List<Note>> searchNotes(String query) async {
    return _retry(() async {
      try {
        final response = await _client.get(
          Uri.parse('$baseUrl/notes/search?q=$query'),
        );
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            List<dynamic> jsonList = jsonResponse['data'];
            return jsonList.map((json) => Note.fromJson(json)).toList();
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to search notes');
          }
        } else {
          throw Exception('Failed to search notes: ${response.body}');
        }
      } catch (e) {
        print('Error searching notes: $e');
        throw Exception('Failed to search notes: $e');
      }
    });
  }

  void dispose() {
    _client.close();
  }
} 