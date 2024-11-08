
# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```
3. Tener nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicacion en dev:
```
npm run start:dev
```

8. Reconstruir la base de datos con la semillas
```
http://localhost:3000/api/v2/seed?limit="valor"
```
reemplazar el valor del limite por el numero de registros a insertar, ejemplo 100.

## Stack usado
* MongoDB
* Nest