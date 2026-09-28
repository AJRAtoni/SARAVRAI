![SARA VRAI](assets/img/og-image-adult.jpg)

# SARA VRAI — landing adulta 18+

Sitio estático de `saravrai.com`, preparado para el relanzamiento de SARA VRAI como musa digital adulta creada con IA.

## Home vigente

- confirmación local de mayoría de edad;
- hero seguro y compatible con Instagram;
- declaración visible de personaje ficticio creado con IA;
- Instagram con atribución UTM;
- Fanvue activo en `https://www.fanvue.com/sara.vrai` con atribución UTM;
- medición de clics salientes mediante el GA4 ya existente;
- diseño móvil y escritorio sin dependencias de ejecución.

Instagram y Fanvue son los únicos canales de SARA VRAI en la web. Sus enlaces están disponibles en `index.html`; la atribución se configura en `assets/js/landing.js`, dentro de `CHANNELS`, sin reemplazar el contenido de las tarjetas.

## Archivo B2B preservado

El reposicionamiento retira servicios, newsletter y ebook de la navegación pública, pero no elimina su código:

- `tuagenteia.html`: servicio histórico de agentes IA.
- `agentes/`: directorio histórico de agentes OpenClaw.
- `assets/js/mailerlite-integration.js`: integración histórica de newsletter.
- historial Git anterior a esta rama: home B2B completa.

## Validación local

Servir la raíz con un servidor estático y comprobar:

1. el aviso 18+ en una sesión sin almacenamiento local;
2. persistencia de la confirmación al recargar;
3. hero y navegación en 390 × 844 y escritorio;
4. que los enlaces salientes añaden `utm_source=saravrai.com`, `utm_medium=referral`, la campaña y el canal/origen en `utm_content`;
5. que Instagram y Fanvue son las dos únicas tarjetas, conservan sus descripciones y enlazan a sus perfiles con UTM;
6. ausencia de errores de consola;
7. metadatos Open Graph y dimensiones 1200 × 630 de `og-image-adult.jpg`.

Los cambios locales solo se reflejan en `saravrai.com` después de publicar y verificar la web pública.
