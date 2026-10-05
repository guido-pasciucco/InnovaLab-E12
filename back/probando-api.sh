#!/bin/bash

BASE_URL="http://127.0.0.1:8000/api/v1"
TOKEN="2|P2ZlJApDnXLORyDjpTskbyJRJSg5KuZBJO0zqLkM489eeceb"

run_test() {
    local title="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"

    echo "============================================================"
    echo "📌 PRUEBA: $title"
    echo "------------------------------------------------------------"
    echo "Request: $method $BASE_URL$endpoint"
    
    # Hacer la petición obteniendo el código de respuesta HTTP
    if [ -n "$data" ]; then
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X "$method" "$BASE_URL$endpoint" \
          -H "Content-Type: application/json" \
          -H "Accept: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "$data")
    else
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X "$method" "$BASE_URL$endpoint" \
          -H "Accept: application/json" \
          -H "Authorization: Bearer $TOKEN")
    fi

    # Separar el cuerpo del código HTTP
    body=$(echo "$response" | sed -e 's/HTTP_STATUS:.*//g')
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

    echo "Status Code: $http_code"
    echo "------------------------------------------------------------"

    if command -v jq &> /dev/null && echo "$body" | jq . >/dev/null 2>&1; then
        echo "$body" | jq .
    else
        echo "$body"
    fi
    echo -e "\n"
}

echo "🚀 INICIANDO BATERÍA DE PRUEBAS DE LA API - INNOVAPAB"
echo "============================================================"
echo ""

# --- MÓDULO DE ESPACIOS ---
run_test "1. Listar todos los espacios" "GET" "/espacios"

run_test "2. Filtrar espacios por tipo (Laboratorio) y estado (disponible)" "GET" "/espacios?tipo=Laboratorio&estado=disponible"

run_test "3. Crear un nuevo espacio (Sala de Debriefing 2)" "POST" "/espacios" '{
  "nombre": "Sala de Debriefing 2",
  "tipo": "Aula",
  "capacidad": 15,
  "ubicacion": "Piso 2 - Ala Sur",
  "estado": "disponible"
}'

run_test "4. Ver detalle del espacio ID 1" "GET" "/espacios/1"

# --- MÓDULO DE EQUIPAMIENTO ---
run_test "5. Listar todo el equipamiento" "GET" "/equipamiento"

echo "✅ PRUEBAS FINALIZADAS"
