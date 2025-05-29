import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/note.dart';

class ApiService {
  static const String _defaultBaseUrl = 'http://localhost:3000/api';
  final String baseUrl;
  final http.Client _client = http.Client();
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 1);

  ApiService({String? baseUrl}) : baseUrl = baseUrl ?? _defaultBaseUrl;

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

  String _getErrorMessage(dynamic error) {
    if (error is http.Response) {
      try {
        final Map<String, dynamic> errorJson = json.decode(error.body);
        return errorJson['message'] ?? 'An error occurred';
      } catch (_) {
        return 'Server error: ${error.statusCode}';
      }
    }
    return error.toString();
  }

  Future<List<Note>> getNotes() async {
    return _retry(() async {
      try {
        final response = await _client.get(Uri.parse('$baseUrl/notes'));
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            List<dynamic> jsonList = jsonResponse['data'];
            return jsonList.map((json) => Note.fromJson(json)).toList();
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to load notes');
          }
        } else {
          throw Exception(_getErrorMessage(response));
        }
      } catch (e) {
        throw Exception('Failed to load notes: ${_getErrorMessage(e)}');
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
        
        if (response.statusCode == 201) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            return Note.fromJson(jsonResponse['data']);
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to create note');
          }
        } else {
          throw Exception(_getErrorMessage(response));
        }
      } catch (e) {
        throw Exception('Failed to create note: ${_getErrorMessage(e)}');
      }
    });
  }

  Future<Note> updateNote(Note note) async {
    if (note.id == null) {
      throw Exception('Note ID is required for update');
    }

    return _retry(() async {
      try {
        final response = await _client.put(
          Uri.parse('$baseUrl/notes/${note.id}'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(note.toJson()),
        );
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] == true) {
            return Note.fromJson(jsonResponse['data']);
          } else {
            throw Exception(jsonResponse['message'] ?? 'Failed to update note');
          }
        } else {
          throw Exception(_getErrorMessage(response));
        }
      } catch (e) {
        throw Exception('Failed to update note: ${_getErrorMessage(e)}');
      }
    });
  }

  Future<void> deleteNote(String id) async {
    return _retry(() async {
      try {
        final response = await _client.delete(Uri.parse('$baseUrl/notes/$id'));
        
        if (response.statusCode == 200) {
          final Map<String, dynamic> jsonResponse = json.decode(response.body);
          if (jsonResponse['success'] != true) {
            throw Exception(jsonResponse['message'] ?? 'Failed to delete note');
          }
        } else {
          throw Exception(_getErrorMessage(response));
        }
      } catch (e) {
        throw Exception('Failed to delete note: ${_getErrorMessage(e)}');
      }
    });
  }

  Future<List<Note>> searchNotes(String query) async {
    if (query.trim().isEmpty) {
      return getNotes();
    }

    return _retry(() async {
      try {
        final response = await _client.get(
          Uri.parse('$baseUrl/notes/search?q=${Uri.encodeComponent(query)}'),
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
          throw Exception(_getErrorMessage(response));
        }
      } catch (e) {
        throw Exception('Failed to search notes: ${_getErrorMessage(e)}');
      }
    });
  }

  void dispose() {
    _client.close();
  }
} 