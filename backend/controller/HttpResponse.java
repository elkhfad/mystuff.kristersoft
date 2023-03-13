package com.MyStuff.Version.controller;

public class HttpResponse {
	public String message;
	public String key;

	public HttpResponse(String key, String message) {
		this.key = key;
		this.message = message;
	}
}
