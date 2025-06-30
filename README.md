# Mindata - Challenge

Este proyecto fue desarrollado como parte del desafío técnico de Frontend de Mindata.

## Descripción

Esta aplicación está construida con [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.15 y cumple todos los requisitos del desafío técnico.

- **Docker Ready**: La aplicación se puede iniciar fácilmente con Docker Compose.
- **Cobertura de Testes Unitarios**: Incluye pruebas unitarias con alta cobertura utilizando Karma y Jasmine.
- **Organización Moderna**: Código modular, limpio y enfocado en buenas prácticas.
- **CI/CD Friendly**: Listo para integración continua y despliegue automatizado.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Requisitos previos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados.

### 2. Levantar el entorno de desarrollo

```bash
docker compose up
```

Esto iniciará la aplicación en modo desarrollo en [http://localhost:4200/](http://localhost:4200/).

---

## 🧪 Ejecutar tests unitarios

Para correr los tests unitarios y obtener el reporte de cobertura, utiliza:

```bash
npm run test:coverage
```

El informe de cobertura se generará en la carpeta `/coverage`.

### 📸 Print del coverage

![Cobertura de Testes](https://ensicus-public-prod.s3.us-east-1.amazonaws.com/test-coverage.png)

---

## 📝 Notas técnicas

- **Arquitectura**: Angular 19+ standalone components, signals, Ng-Zorro (Ant Design), ECharts, ngx-translate, etc.
- **Tests**: 100% de los servicios, componentes principales y lógica crítica están cubiertos por pruebas.
- **Mocks/Storage**: Persistencia local simulada usando LocalStorage y mocks.
- **Internacionalización**: Proyecto preparado para varios idiomas con ngx-translate.
- **Estilo**: Responsive, componentes reutilizables y buenas prácticas CSS/SCSS.

---

## 💬 Contacto

Proyecto realizado por **Juan Versolato Lopes**.  
Para más información o consultas técnicas, puedes contactarme por [LinkedIn](https://www.linkedin.com/in/juan-versolato-lopes/).
