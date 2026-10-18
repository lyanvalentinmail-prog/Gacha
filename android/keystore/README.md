# Clave de firma para los APK de GitHub Actions

`chibiverse-release.p12` es una clave **pública y compartida** que se usa únicamente
para firmar los APK que se descargan directamente desde GitHub Releases y para que
las actualizaciones se instalen encima de la versión anterior sin desinstalar
(Android exige que todas las versiones de una app tengan la misma firma).

Datos de la clave:

| Campo | Valor |
| --- | --- |
| Archivo | `chibiverse-release.p12` |
| Tipo | PKCS12 |
| Alias | `chibiverse` |
| Contraseña del almacén | `chibiverse` |
| Contraseña de la clave | `chibiverse` |

> ⚠️ No uses esta clave para publicar en Google Play ni para una app con datos
> sensibles: al estar en un repositorio público, cualquiera puede firmar un APK
> que Android acepte como actualización. Es el precio de que cualquiera pueda
> compilar el proyecto sin configurar secretos. Si algún día publicas en Play
> Store, genera una clave privada nueva y guárdala en los *Secrets* del repo.
