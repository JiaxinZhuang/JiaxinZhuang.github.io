(function () {
  function renderPublications() {
    var root = document.getElementById("publications-root");
    if (!root || !Array.isArray(window.publications)) return;

    var items = window.publications.slice().sort(function (a, b) {
      return Number(b.year) - Number(a.year);
    });

    var byYear = new Map();
    items.forEach(function (item) {
      var year = String(item.year || "");
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(item);
    });

    var html = '<table class="pub-list" style="width:100%;border:0px;border-spacing:0 8px;border-collapse:separate;margin-right:auto;margin-left:auto;"><tbody>';
    byYear.forEach(function (yearItems, year) {
      html += '<tr><td><div class="pub-year">' + year + "</div></td></tr>";
      yearItems.forEach(function (item) {
        var title = item.title || "";
        var titleHtml = item.titleUrl
          ? '<a href="' + item.titleUrl + '"><span class="pub-title">' + title + "</span></a>"
          : '<span class="pub-title">' + title + "</span>";
        var venueHtml = item.venue ? '<span class="venue">' + item.venue + "</span>" : "";
        var notesHtml = item.notes ? " " + item.notes : "";
        var linksHtml = "";
        if (Array.isArray(item.links) && item.links.length > 0) {
          linksHtml = '<div class="pub-links">';
          item.links.forEach(function (link) {
            if (!link || !link.url || !link.label) return;
            linksHtml += '<a class="pub-link" href="' + link.url + '">' + link.label + "</a>";
          });
          linksHtml += "</div>";
        }

        html += '<tr><td class="pub-item">' +
          titleHtml +
          "<br>" +
          '<span class="pub-authors">' + (item.authors || "") + "</span> " +
          venueHtml +
          notesHtml +
          linksHtml +
          "</td></tr>";
      });
    });
    html += "</tbody></table>";

    root.innerHTML = html;
  }

  function renderNews() {
    var root = document.getElementById("news-root");
    if (!root || !Array.isArray(window.newsItems)) return;

    var html = "";
    window.newsItems.forEach(function (item) {
      var date = item.date ? "[" + item.date + "]" : "";
      var text = item.html ? item.html : (item.text || "");
      html += "<p><span class=\"news-date\">" + date + "</span> " + text + "</p>";
    });
    root.innerHTML = html;
  }

  function hydratePageData() {
    renderPublications();
    renderNews();
  }

  window.addEventListener("partials:loaded", hydratePageData);
  window.addEventListener("DOMContentLoaded", hydratePageData);

  var retryCount = 0;
  var retryTimer = setInterval(function () {
    retryCount += 1;
    hydratePageData();
    if (
      document.getElementById("publications-root") &&
      document.getElementById("news-root")
    ) {
      clearInterval(retryTimer);
    }
    if (retryCount > 20) {
      clearInterval(retryTimer);
    }
  }, 200);
})();
