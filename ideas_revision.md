# Revisión Weather CLI

- [x] **Colores:** paleta aplicada: cyan (título/borde del menú), amarillo (temperatura), verde (éxitos) y rojo (errores) en `src/ui.ts`.
- [x] **AGENTS.md:** actualizado a la app funcional (estructura, comandos y helpers de color).
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?