// «Отправить в хаб» — личный плагин страницы (владелец 05.10, d20487): ссылку можно вставить куда угодно (Teams,
// почта, чат) — открыл её у себя, текст уже в поле ввода хаба. Отправка — ВСЕГДА своим кликом/Enter, не по самой
// ссылке: владелец прямо выбрал это на вопрос q20515 (не рекомендованный хабом вариант с ключом в ссылке, а прямой
// ответ владельца — он главнее). Чужая ссылка с чужим текстом безопасна ровно поэтому: она не может сама ничего
// отправить, только подставить текст, который владелец всё равно видит и решает сам.
//
// Текст — в HASH (`#send=<urlencoded>`), не в query (`?send=...`): страница отдаёт себя строгим сравнением
// `self.path in ("/", "/index.html")` (modules/web/server.py) — с чем угодно после `?` в пути это сравнение не
// совпадает, и страница вообще не загружается (нашла вживую: пустое тело, 404 от сервера). Хэш браузер серверу
// не отправляет вовсе — то же разделение, что у OAuth implicit-flow токенов, и не зря.
//
// Подстановка — как Escape-recall (владелец 01.10): `ta.value = …; ta.dispatchEvent(new Event("input"))`, не через
// состояние — иначе dock.js не пересоздаёт поле (dockKey не меняется) и значение не показывается.
//
// Кнопки «скопировать ссылку» нет (убрал владелец 05.10, m20701): ссылку он сам пишет в конце сообщения, которое
// диктует в Teams кому-то через хаб — руками, не из поля ввода хаба.

function fillWhenReady(hub, text) {
  const hubSess = (hub.snapshot()?.sessions || []).find((s) => s.kind === "hub");
  if (!hubSess) { requestAnimationFrame(() => fillWhenReady(hub, text)); return; }
  const want = "#/s/" + encodeURIComponent(hubSess.name);
  if (location.hash !== want) location.hash = want;
  const ta = document.getElementById("msg");
  if (!ta) { requestAnimationFrame(() => fillWhenReady(hub, text)); return; }
  ta.value = text;
  ta.dispatchEvent(new Event("input"));
  ta.focus();
}

export default function register(hub) {
  const m = location.hash.match(/^#send=(.*)$/);
  if (m) {
    const text = decodeURIComponent(m[1]);
    history.replaceState(null, "", location.pathname + location.search);  // ссылку второй раз по F5 не повторять
    requestAnimationFrame(() => fillWhenReady(hub, text));
  }
}
