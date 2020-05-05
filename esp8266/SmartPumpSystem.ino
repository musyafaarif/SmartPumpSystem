#include <Arduino.h>
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

ESP8266WiFiMulti WiFiMulti;

#define SSID        "msyf"
#define PASS        "12345678"
#define HOST        "10.208.100.111"
#define PORT        8000
#define HTTPS       false
#define USERNAME    "admin"
#define PASSWORD    "1234"
#define HOST_ID     47

struct Response
{
    int status;
    String payload;
};

WiFiClient client;
HTTPClient http;

String auth;
String cookies;
String csrfToken;

const char * headerKeys[]   = {"Set-Cookie"};
const size_t headerSize     = 1;

int httpCode;


// System Hosts Variables
const uint16_t pumpsID[] = {16, 17, 18, 19, 20};
const uint16_t pumpCount = 5;

enum HostStatus {
    SIAGA_1         = 1,
    SIAGA_2,
    SIAGA_3,
    SIAGA_4
};

enum PumpStatus {
    OFF             = 1,
    TURNING_OFF,
    TURNING_ON,
    ON,
    MAINTENANCE,
    BROKEN,
    FAILURE
};

struct Pump
{
    uint16_t id;
    PumpStatus status;
};

Pump pump[pumpCount];

// Functions and Methods
void initSystem();
void processPump(int index);
void processPump(uint16_t id);
void setPumpStatus(Pump pump, PumpStatus status);
void getPumpStatus(int index);
PumpStatus getPumpStatus(uint16_t id);
bool requestTurnOnPump(Pump pump);

void login();
void sendSensorData();
String serializeSensorData(float);

void setup() {
    Serial.begin(115200);
    Serial.setTimeout(1000000);
    Serial.flush();

    Serial.println("Connecting to Wifi..");
    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(SSID, PASS);

    while ((WiFiMulti.run() != WL_CONNECTED)) delay(100);
    Serial.println("Connecting to Server..");
    Serial.println("Logging in..");

    login(USERNAME, PASSWORD);
    initSystem();
}

void loop() {
    if ((WiFiMulti.run() == WL_CONNECTED)) {
        sendSensorData();
    }

    for ( int i = 0; i < pumpCount; i++ ) {
        getPumpStatus(i);
        processPump(i);
    }
}

void initSystem() {
    for (int i = 0; i < pumpCount; i++) {
        pump[i].id = pumpsID[i];
        pump[i].status = getPumpStatus(pump[i].id);
    }
}

void login(String username, String password) {
    // Try until auth token collected
    while ( auth == "" ) {

        if ((WiFiMulti.run() == WL_CONNECTED)) {
            // Begin socket
            if ( http.begin(client, HOST, PORT, "/api/auth/login") ) {
                Response response;

                // Headers
                http.addHeader("Content-Type", String("application/json"));

                // Post request
                response.status = http.POST(String("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"));
                response.payload = http.getString();

                // Request accepted
                if (response.status == 200) {
                    // Parse Token
                    const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 130;
                    DynamicJsonDocument doc(capacity);

                    if ( !deserializeJson(doc, response.payload) ) {
                        const char * token = doc["token"];
                        auth = String("Token ") + token;
                    }
                } else delay(1000);
            }
        }
    }
}

void processPump(int index) {
    PumpStatus status = pump[index].status;

    if ( status == PumpStatus::TURNING_OFF ) {
        setPumpStatus(pump[index], PumpStatus::OFF);
    } else if ( status == PumpStatus::TURNING_ON ) {
        if ( requestTurnOnPump(pump[index]) ) {
            setPumpStatus(pump[index], PumpStatus::ON);
        } else {
            setPumpStatus(pump[index], PumpStatus::BROKEN);
        }
    }
}

void setPumpStatus(Pump pump, PumpStatus status) {
    while (true && pump.status != status) {
        if ( http.begin(client, HOST, PORT, String("/pumps/") + pump.id + "/") ) {
            Response response;

            // Parsing
            const size_t capacity = JSON_OBJECT_SIZE(1);
            DynamicJsonDocument doc(capacity);
            doc["status_level"] = status;

            String request;

            if ( serializeJson(doc, request) ) {
                // Authorization and Headers
                http.addHeader("Authorization", auth.c_str());
                http.addHeader("Content-Type", "application/json");

                // Send get request
                response.status = http.PATCH(request);
                response.payload = http.getString();

                // Request accepted
                if ( response.status == 200 ) {
                    pump.status = status;
                    return;
                } else Serial.println(response.payload);
            }
        }
    }
}

void getPumpStatus(int index) {
    pump[index].status = getPumpStatus(pump[index].id);
}

PumpStatus getPumpStatus(uint16_t id) {
    while (true) {
        if ( http.begin(client, HOST, PORT, String("/pumps/") + id + "/?format=json") ) {
            Response response;

            // Send get request
            response.status = http.GET();
            response.payload = http.getString();

            // Request accepted
            if ( response.status == 200 ) {
                // Parse
                const size_t capacity = JSON_OBJECT_SIZE(5) + 140;
                DynamicJsonDocument doc(capacity);

                if ( !deserializeJson(doc, response.payload) ) {
                    const int status = doc["status_level"];
                    return (PumpStatus)status;
                }
            } else delay(1000);
        }
    }
}

bool requestTurnOnPump(Pump pump) {
    // TODO
    return rand() % 2 == 1;
}

String serializeSensorData(float water_level) {
    const size_t capacity = JSON_OBJECT_SIZE(1);
    StaticJsonDocument<capacity> doc;

    doc["water_level"] = water_level;

    String output;
    serializeJson(doc, output);

    return output;
}

void sendSensorData() {
    String request = serializeSensorData(1.0f + rand() % 5000 / 10000.0f);
    Response response;

    // Try until Patch request accepted
    while ( response.status != 200 ) {

        // Begin HTTP Client socket
        if ( http.begin(client, HOST, PORT, String("/hosts/") + HOST_ID + "/") ) {

            // Authorization and Headers
            http.addHeader("Authorization", auth.c_str());
            http.addHeader("Content-Type", "application/json");

            // Send Patch Request
            response.status = http.PATCH(request);
            response.payload = http.getString();

            // Close Client
            http.end();

        } else delay(50);
    }
}
