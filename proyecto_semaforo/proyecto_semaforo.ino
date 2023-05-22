#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include <ESP32Time.h>

using namespace websockets;

#define verde 26     //Puerto en el que esta el LED Verde
#define amarillo 25  //Puerto en el que esta conectado el LED amarillo
#define rojo 17      //Puerto en el que esta conectado el LED rojo
#define trig 14
#define echo 27



int segundo = 1000;
unsigned long now = 0;
int conteoVerde = 0;
int conteoAmarillo = 0;
int conteoRojo = 0;
long tiempo_echo = 0;
long distancia = 0;
long sueloFijo = 0;
long alturaVehiculo = 0;
bool bandera = true;


const char* ssid = "ESP32";                //Enter SSID
const char* password = "ESP32ESP32ESP32";  //Enter Password
WebsocketsClient client;
WebsocketsServer server;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -6 * 3600;
const int daylightOffset_sec = 0;

ESP32Time rtc;


void setup() {
  Serial.begin(921600);
  pinMode(verde, OUTPUT);
  pinMode(amarillo, OUTPUT);
  pinMode(rojo, OUTPUT);
  pinMode(trig, OUTPUT);    //pin como salida
  pinMode(echo, INPUT);     //pin como entrada
  digitalWrite(trig, LOW);  //Inicializamos el pin con 0

  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for (int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
  }
  server.listen(80);
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  client = server.accept();
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    rtc.setTimeStruct(timeinfo);
  }
}

void loop() {
  if (client.available()) {
    Verde();
    Amarillo();
    Rojo();
  } else {
    client = server.accept();
  }
}

String envioDatos(int cantidadCarros, String inicioFecha, String finalFecha, int colorId, String inicioHora, String finalHora) {
  return "{\"cantidadCarros\":" + String(cantidadCarros) + ",\"inicioFecha\":\"" + inicioFecha + "\",\"finalFecha\":\"" + finalFecha + "\",\"dispositivoId\":1,\"colorId\":" + String(colorId) + ",\"inicioHora\":\"" + inicioHora + "\",\"finalHora\":\"" + finalHora + "\"}";
}


String getHora() {
  return rtc.getTime("%H:%M:%S");
}

String getFecha() {
  return rtc.getTime("%Y-%m-%d");
}

void Verde() {
  String inicioFecha = getFecha();
  String inicioHora = getHora();
  conteoVerde = 0;
  client.send("{\"color\":\"verde\"}");
  now = millis();
  Serial.println("Verde");
  digitalWrite(verde, HIGH);
  digitalWrite(amarillo, LOW);
  digitalWrite(rojo, LOW);
  while (millis() <= now + segundo * 10) {
    if (detectar()) {
      conteoVerde++;
      String carros = "{\"carros\":\"verde\",\"cantidad\":" + String(conteoVerde) + "}";
      client.send(carros);
      Serial.println(conteoVerde);
    }
  }
  String finalFecha = getFecha();
  String finalHora = getHora();
  client.send(envioDatos(conteoVerde, inicioFecha, finalFecha, 1, inicioHora, finalHora));
}

void Amarillo() {
  String inicioFecha = getFecha();
  String inicioHora = getHora();
  conteoAmarillo = 0;
  now = millis();
  client.send("{\"color\":\"amarillo\"}");
  Serial.println("Amarillo");
  digitalWrite(verde, LOW);
  digitalWrite(amarillo, HIGH);
  while (millis() <= now + segundo * 10) {
    if (detectar()) {
      conteoAmarillo++;
      String carros = "{\"carros\":\"amarillo\",\"cantidad\":" + String(conteoAmarillo) + "}";
      client.send(carros);
      Serial.println(conteoAmarillo);
    }
  }
  String finalFecha = getFecha();
  String finalHora = getHora();
  client.send(envioDatos(conteoAmarillo, inicioFecha, finalFecha, 2, inicioHora, finalHora));
}

void Rojo() {
  String inicioFecha = getFecha();
  String inicioHora = getHora();
  conteoRojo = 0;
  client.send("{\"color\":\"rojo\"}");
  now = millis();
  Serial.println("Rojo");
  digitalWrite(amarillo, LOW);
  digitalWrite(rojo, HIGH);
  while (millis() < now + segundo * 10) {
    if (detectar()) {
      conteoRojo++;
      String carros = "{\"carros\":\"rojo\",\"cantidad\":" + String(conteoRojo) + "}";
      client.send(carros);
      Serial.println(conteoRojo);
    }
  }
  String finalFecha = getFecha();
  String finalHora = getHora();
  client.send(envioDatos(conteoAmarillo, inicioFecha, finalFecha, 3, inicioHora, finalHora));
}

bool detectar() {
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);  //Enviamos un pulso de 10us
  digitalWrite(trig, LOW);
  tiempo_echo = pulseIn(echo, HIGH);  //obtenemos el ancho del pulso
  distancia = tiempo_echo / 59;
  if (sueloFijo == 0) {
    sueloFijo = distancia;
    Serial.println(distancia);
    bandera = false;
    return false;
  }

  if (distancia < sueloFijo - 2) {
    bandera = true;
    return false;
  } else {
    if (bandera && distancia <= 100) {
      bandera = false;
      return true;
    }
    return false;
  }
}
