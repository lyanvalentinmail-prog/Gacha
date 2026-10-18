# ✨ Chibiverse Gacha Studio 2D

Un videojuego Gacha 2D completo, original y funcional de estilo anime / chibi, inspirado en las mejores mecánicas de *Gacha Life* y *Gacha Club*, con la **estética clásica de Gacha Life**: cielo azul con nubes, botones rosas y azules 3D, paneles celestes con contorno azul marino, máquina de gacha de cápsulas y tipografía bubbly redondeada.

[![Descargar APK](https://img.shields.io/badge/Descargar-APK%20para%20Android-FF6F91?style=for-the-badge&logo=android&logoColor=white)](https://github.com/lyanvalentinmail-prog/Gacha/releases/latest)
[![APK Android](https://github.com/lyanvalentinmail-prog/Gacha/actions/workflows/android-apk.yml/badge.svg)](https://github.com/lyanvalentinmail-prog/Gacha/actions/workflows/android-apk.yml)

---

## 📱 Descargar e instalar en Android

Cada vez que se sube un cambio a `main`, **GitHub Actions** compila el APK firmado y lo publica en
[Releases](https://github.com/lyanvalentinmail-prog/Gacha/releases). No necesitas Android Studio ni
compilar nada para jugar en el teléfono.

### 1. Descarga el APK

<p align="center">
  <img src="assets/apk-qr.png" alt="Código QR para descargar el APK" width="180" />
  <br />
  <sub>Escanea el QR con la cámara del teléfono y descarga la última APK.</sub>
</p>

- Última versión (enlace directo):
  **<https://github.com/lyanvalentinmail-prog/Gacha/releases/latest/download/Chibiverse-Gacha-Studio.apk>**
- Todas las versiones: **<https://github.com/lyanvalentinmail-prog/Gacha/releases>**

### 2. Instálalo en el teléfono

1. Abre el enlace desde el navegador del teléfono (Chrome, Firefox, etc.) y descarga el archivo `.apk`.
2. Toca el archivo descargado o ábrelo desde **Archivos → Descargas**.
3. Si Android indica *«Por seguridad, tu teléfono no puede instalar apps de esta fuente»*, toca
   **Ajustes** y activa **Permitir desde esta fuente** para el navegador o el gestor de archivos.
4. Si aparece el aviso de **Play Protect**, elige **«Instalar de todas formas»**. El aviso sale porque
   la APK se firma fuera de Google Play, no porque la app tenga malware.
5. Abre **Chibiverse Gacha Studio** y ¡listo! ✨

> **Requisitos:** Android 7.0 (API 24) o superior. La primera apertura tarda unos segundos mientras la
> WebView carga todos los recursos del juego.

**Actualizaciones:** descarga la nueva APK desde la última release e instálala encima de la anterior.
Como todas las versiones se firman con la misma clave, Android no te pedirá desinstalar y tus
personajes, gemas y escenas guardadas se conservan.

### 3. Compilar la APK tú mismo (opcional)

Requisitos: Node.js 22+, JDK 21 y Android SDK con la plataforma 36.

```bash
npm ci
npm run build
npx cap sync android
cd android
./gradlew assembleRelease      # En Windows: gradlew.bat assembleRelease
```

El APK firmado queda en `android/app/build/outputs/apk/release/app-release.apk`. También puedes abrir la
carpeta `android/` con Android Studio para ejecutar la app en un emulador o dispositivo físico.

---

## 🌟 Características Principales

### 0. Menú Principal estilo Gacha Life
La pantalla de inicio replica la clásica interfaz de *Gacha Life*:
- **Panel izquierdo**: slots de personajes (miniaturas vivas) con botón **Slots** para crear más.
- **Escena central**: tu chibi sobre un fondo de parque (u otros fondos) con botones flotantes:
  **Fondo**, **Skits**, **Gacha**, **Zoom**, **Ocultar**, **Regalos**, **Juegos**.
- **Panel derecho "Vestir"**: botones de categoría (Preajustes, Cuerpo, Cabello, Rostro, Ropa,
  Otros, Objetos, Perfil) más el botón grande **Estudio** y **Opciones**.

### 1. Editor de Personajes Completo
- **Cabello Multicapa**:
  - Peinados delanteros (flequillos: recto, hacia un lado, cortina, despeinado spiky, estilo hime, corazón, trenza diadema).
  - Peinados traseros (coletas bajas, coletas altas con rebote, liso sedoso, ondas de princesa, bob chibi, moños odango, espirales ojou-sama, wolf cut, melena nube).
  - Mechones laterales y Ahoge (antena clásica, corazón, mechones largos).
  - Paleta completa de colores con selector RGB/HEX: color base, tinte/degradado de puntas y color de contorno/sombra.
- **Rostro & Ojos Expresivos**:
  - Formas de ojos anime con brillo triple, rasgados de gato, ojos redondos kawaii, mirada idol, estrellas cósmicas, corazones y cruces místicas.
  - Pupilas ajustables (chibi, gato, estrella, flor).
  - Color primario y reflejo secundario del iris.
  - Cejas (suaves, confiadas, preocupadas, gruesas chibi, puntitos kuge nobles).
  - Expresiones faciales instantáneas (Feliz, Guiño pícaro, Smug, Dormido, Tímido sonrojado, Enfadado).
  - Boca variada (sonrisa tímida, risa radiante, boca gatuna :3, colmillo travieso, puchero, sorpresa "O").
  - Sonrojo y marcas (rosado suave, rayitas manga, ultra avergonzado, stickers de estrellas, sellos de corazón, curita en la nariz, lágrimas brillantes).
- **Prendas de Ropa**:
  - Tops: marinero escolar (seifuku), sudadera oversize con orejitas, blusa idol con volantes y lazo, chaleco de academia, corsé lolita victoriano, camiseta de oso kawaii, túnica astral de mago, delantal maid café, chaqueta cyber holográfica, yukata tradicional.
  - Faldas y Pantalones: falda de tablas, falda de volantes múltiples, shorts de denim, pantalones anchos pastel, bombachos dulces con lazos, falda de constelaciones galácticas.
  - Calzado & Calcetines: zapatillas chunky, Mary Janes de charol, botas altas de combate, zapatillas con lazo de seda, mocasines escolares, pantuflas de patitas.
  - Personalización cromática de cada prenda y sus complementos.
- **Accesorios & Fantasía**:
  - Sombreros y diademas: boina artística, orejas de gato con cascabel, orejas de conejo, sombrero de brujita, audífonos gamer neko RGB, corona real, aureola celestial dorada, cuernos de diablillo, flor sakura, tocado de maid.
  - Gafas y rostro: gafas redondas doradas, gafas de corazón retro, parche médico chuunibyou, mascarilla kawaii.
  - Cuello: gargantilla con cascabel, gran lazo de satén, bufanda tejida, colgante estelar.
  - Alas: querubín, murciélago travieso, hada cristalina, dragón legendario, propulsores cyber gravitatorios.
  - Colas: gato con lazo, nueve colas kitsune, pompón de conejo, cola de diablo con flecha, cola de dragón.
  - Objetos en mano (Props): varita mágica de estrellas, té boba con tapioca, osito de peluche, mando portátil retro gamer, espada de cristal radiante, micrófono idol, paleta de pintura, grimorio de hechizos, báculo cósmico.
  - Auras ambientales: destellos mágicos, brisa de pétalos sakura, corazones flotantes, círculo rúnico giratorio, llamas sombrías, nebulosa astral.
- **Poses & Tono de Piel**:
  - Poses completas: de pie natural, señal de paz "V", saludo alegre, manos en la cintura, tímida con manos juntas, lanzando encantamiento mágico, sentada kawaii, salto dinámico en el aire.
  - Variedad de tonos de piel: porcelana, cálido, beige natural, bronce, café profundo, hada lila y nieve menta.

### 2. Sistema de Slots & Gestión de Personajes
- **Slots ilimitados con previsualización en miniatura en el lateral**:
  - Alternar entre personajes con un solo clic sin perder cambios.
  - Funciones para **Crear nuevo slot**, **Duplicar personaje**, **Renombrar**, **Eliminar**, **Exportar código JSON** e **Importar personaje**.
  - Historial de cambios con **Deshacer (Ctrl+Z)** y **Rehacer (Ctrl+Y)**.
  - Botón de **Aleatorizar** armonioso que combina colores y prendas de forma coherente.
  - Botón de **Foto PNG** transparente de alta resolución.

### 3. Modo Estudio (Scene & Comic Creator)
- Staging interactivo con múltiples personajes en escena.
- Fondos temáticos de alta calidad: Parque de Sakura, Salón Escolar, Habitación Pastel, Café Dulce, Cielo Nocturno Astral, Ciudad Cyberpunk Neón, Atardecer en la Playa, Santuario en las Nubes, Estudio Cuadriculado y Croma Verde.
- Controles de transformación en tiempo real: arrastrar y soltar (drag & drop), tamaño/escala, volteo horizontal, rotación y ajuste de capas (traer al frente / enviar al fondo).
- Cambio individual de poses y posturas para cada personaje en la escena.
- **Bocadillos de Diálogo interactivos** con textos personalizados y colas direccionales.
- **Stickers & Efectos Decorativos**: corazones, destellos, estrellas, gotas de sudor, venas de enfado, notas musicales, mascotas gato/conejo, fuego cósmico y nubes.
- **Exportación de Escena a Imagen PNG** con renderizado completo de fondo, personajes y globos de texto.

### 4. Sistema Gacha de Invocaciones
- Banners temáticos con rate-up:
  - *Pabellón Astral & Celestial* (Alas de Ángel, Báculo Cósmico, Aureola).
  - *Idol Dream Festival* (Atuendos Idol, Audífonos Gamer RGB, Varita de Estrellas).
  - *Cosplay Fantasía & Mística* (Cola de Kitsune, Sombrero de Brujita, Corsé Gótico).
- Tirada Simple (1x por 100 gemas) y Tirada Múltiple (10x por 900 gemas con 4★+ garantizado).
- Animación de invocación con círculo rúnico giratorio y revelación por rareza con fanfarria sonora.
- Historial completo de invocaciones registradas con fecha y rareza.
- Probabilidades transparentes configurables (3★: 75%, 4★: 20%, 5★: 4%, 6★: 1%).
- Moneda 100% virtual: Bono diario de +1,000 gemas y misiones con recompensas para jugar libremente sin pagos reales.

### 5. Galería de Colección & Armario
- Consulta todos los cosméticos disponibles clasificados por rareza y categoría.
- Indicador visual de completitud con porcentaje.
- Botón directo para **Equipar en Personaje Actual** cualquier elemento desbloqueado.

### 6. Sintetizador de Audio Procedural Web Audio API
- Efectos sonoros integrados sin descargas externas: clics de interfaz, cambios de pestaña, equipamiento de ropa, torbellino gacha, campana de revelación, fanfarria triunfal 5★ y clic de obturador de cámara fotográfica.
- Botón para silenciar/activar sonido en el encabezado.

---

## 📁 Assets — ropa, accesorios y partes de cuerpo

**Todo el arte del juego vive en [`assets/items/`](assets/items/)**, organizado en carpetas
(`ropa/`, `cabello/`, `rostro/`, `accesorios/`, `extras/`, `props/`, `cuerpo/`, `fondos/`).
Cada item son archivos hermanos:

```
assets/items/ropa/tops/mi-sudadera.svg   ← el dibujo
assets/items/ropa/tops/mi-sudadera.txt   ← el nombre (un renglón)
assets/items/ropa/tops/mi-sudadera.json  ← rareza y descripción (opcional)
```

El juego los detecta automáticamente al compilar: **para agregar ropa o cosas nuevas sólo
hay que soltar los archivos en la carpeta correcta** (sin tocar código). Los items de rareza
4★-6★ entran solos al pool del Gacha y a la colección.

📖 **Guía completa: [`assets/items/README.md`](assets/items/README.md)**

## 🛠️ Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Vite 6** (servidor ultrarrápido y compilador optimizado)
- **Tailwind CSS** con paleta de colores anime pastel personalizada
- **SVG Vector Rendering Engine** para dibujo chibi nítido a cualquier resolución
- **HTML5 Canvas** para exportación de imágenes PNG de alta calidad
- **Web Audio API** para sonidos en tiempo real
- **Lucide Icons** para iconografía moderna y limpia
- **Capacitor 8** para empaquetar el juego como app Android nativa (APK firmado)
- **GitHub Actions** para compilar y publicar el APK automáticamente en cada push

---

## 🚀 Instrucciones para Ejecutar y Compilar

### Requisitos previos
- Node.js 22 o superior (lo exige Capacitor 8)
- npm 10 o superior
- Para generar el APK: JDK 21 y Android SDK 36 (o dejar que lo haga GitHub Actions)

### Ejecutar en modo desarrollo
```bash
npm install
npm run dev
```
El juego estará disponible inmediatamente en `http://localhost:5173` (o la URL de preview de Arena).

### Compilar para producción
```bash
npm run build
```
Los archivos optimizados y listos para distribución se generarán en la carpeta `dist/`.

---

## 🤖 Compilación automática del APK (GitHub Actions)

El workflow [`.github/workflows/android-apk.yml`](.github/workflows/android-apk.yml) se encarga de todo:

| Evento | Qué hace |
| --- | --- |
| Push a `main` | Compila la web, sincroniza Capacitor, genera el APK firmado y actualiza la release `latest`. |
| Tag `v*` (p. ej. `git tag v1.2.0 && git push origin v1.2.0`) | Crea una release con esa versión. |
| Pull request hacia `main` | Solo compila (sin publicar) para validar los cambios. |
| Manual (*Actions → APK Android → Run workflow*) | Compila y publica cuando tú quieras. |

El APK también queda como **artefacto** de la ejecución durante 90 días, por si necesitas descargar
una compilación concreta.

### Versionado y firma

- `versionName` = `1.0.<número de ejecución>` (o el tag `vX.Y.Z` si lo hay) y `versionCode` = número de
  ejecución, así cada build se instala encima de la anterior.
- Las releases se firman con la clave incluida en [`android/keystore`](android/keystore/README.md)
  (contraseña `chibiverse`). Es lo que permite actualizar sin desinstalar.

> ⚠️ Esa clave es pública a propósito, para que cualquiera pueda compilar el proyecto sin configurar
> secretos. No la uses para publicar en Google Play: si algún día subes la app a la tienda, genera una
> clave privada nueva y guárdala en los *Secrets* del repositorio.

### Datos y privacidad

La app funciona 100 % en el dispositivo: personajes, gemas, escenas e historial se guardan en el
almacenamiento local de la WebView (`localStorage`). No hay cuentas, servidores ni compras reales.
