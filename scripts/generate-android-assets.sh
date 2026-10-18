#!/usr/bin/env bash
#
# Regenera los iconos y pantallas de carga de Android a partir de
# assets/icon-square.png (1024x1024). Requiere ImageMagick (`convert`).
#
#   bash scripts/generate-android-assets.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="assets/icon-square.png"
RES="android/app/src/main/res"
TMPDIR_ASSETS="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_ASSETS"' EXIT

if [ ! -f "$SRC" ]; then
  echo "No se encontró $SRC" >&2
  exit 1
fi

command -v convert >/dev/null 2>&1 || {
  echo "ImageMagick no está instalado (falta el comando 'convert')." >&2
  exit 1
}

# Crea una versión de la imagen con esquinas redondeadas o recortada en círculo.
# Uso: rounded <origen> <destino> <tamaño> <radio>
rounded() {
  local src="$1" dst="$2" size="$3" radius="$4"
  convert "$src" -strip -filter Lanczos -resize "${size}x${size}" \
    \( -size "${size}x${size}" xc:black -fill white \
       -draw "roundrectangle 0,0 $((size - 1)),$((size - 1)) ${radius},${radius}" \) \
    -alpha off -compose CopyOpacity -composite \
    "$dst"
}

# ---------- Iconos clásicos (Android 7) ----------
for pair in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  density="${pair%%:*}"
  size="${pair##*:}"
  convert "$SRC" -strip -filter Lanczos -resize "${size}x${size}" \
    "$RES/mipmap-${density}/ic_launcher.png"
done

# ---------- Iconos redondos ----------
for pair in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  density="${pair%%:*}"
  size="${pair##*:}"
  radius=$((size / 2))
  rounded "$SRC" "$RES/mipmap-${density}/ic_launcher_round.png" "$size" "$radius"
done

# ---------- Capa frontal de los iconos adaptativos (Android 8+) ----------
# El lienzo adaptativo es de 108dp y solo se muestran los 66dp centrales,
# por eso la ilustración se escala al 88% y se centra con margen transparente.
for pair in mdpi:108 hdpi:162 xhdpi:216 xxhdpi:324 xxxhdpi:432; do
  density="${pair%%:*}"
  size="${pair##*:}"
  art=$((size * 88 / 100))
  convert -size "${size}x${size}" xc:none \
    \( "$SRC" -strip -filter Lanczos -resize "${art}x${art}" \) \
    -gravity center -composite \
    "$RES/mipmap-${density}/ic_launcher_foreground.png"
done

# ---------- Pantallas de carga (splash) ----------
# Fondo degradado pastel con el icono redondeado en el centro.
# Se conservan los tamaños originales de las imágenes de Capacitor.
while read -r file width height; do
  icon=$(( (width < height ? width : height) * 46 / 100 ))
  rounded "$SRC" "$TMPDIR_ASSETS/splash-icon.png" "$icon" "$((icon / 5))"
  convert -size "${width}x${height}" gradient:'#FFD9E8-#DCD4FF' \
    "$TMPDIR_ASSETS/splash-icon.png" -gravity center -composite \
    -strip "$file"
done <<'EOF'
android/app/src/main/res/drawable/splash.png 480 320
android/app/src/main/res/drawable-land-mdpi/splash.png 480 320
android/app/src/main/res/drawable-land-hdpi/splash.png 800 480
android/app/src/main/res/drawable-land-xhdpi/splash.png 1280 720
android/app/src/main/res/drawable-land-xxhdpi/splash.png 1600 960
android/app/src/main/res/drawable-land-xxxhdpi/splash.png 1920 1280
android/app/src/main/res/drawable-port-mdpi/splash.png 320 480
android/app/src/main/res/drawable-port-hdpi/splash.png 480 800
android/app/src/main/res/drawable-port-xhdpi/splash.png 720 1280
android/app/src/main/res/drawable-port-xxhdpi/splash.png 960 1600
android/app/src/main/res/drawable-port-xxxhdpi/splash.png 1280 1920
EOF

echo "Iconos y pantallas de carga regenerados en $RES"
