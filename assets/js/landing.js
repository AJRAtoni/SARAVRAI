(function () {
  "use strict";

  const AGE_KEY = "sara_vrai_age_confirmed_v1";
  const SOURCE_KEY = "sara_vrai_first_source_v1";
  const CAMPAIGN = "relaunch_2026";
  const CHANNELS = {
    instagram: "https://www.instagram.com/sara.vrai/",
    x: "https://x.com/saravr_ai",
    fanvue: "https://www.fanvue.com/sara.vrai",
  };

  const body = document.body;
  const gate = document.getElementById("age-gate");
  const shell = document.getElementById("site-shell");
  const confirmButton = document.getElementById("confirm-age");
  const leaveButton = document.getElementById("leave-site");
  const querySource = new URLSearchParams(window.location.search).get("utm_source");

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // The gate still works for the current page when storage is unavailable.
    }
  }

  function unlock() {
    body.classList.remove("age-locked");
    gate.classList.add("is-hidden");
    gate.setAttribute("aria-hidden", "true");
    shell.setAttribute("aria-hidden", "false");
    shell.inert = false;
  }

  const inboundSource = querySource || storageGet(SOURCE_KEY) || "direct";
  if (querySource && !storageGet(SOURCE_KEY)) storageSet(SOURCE_KEY, querySource);

  function buildTrackedUrl(baseUrl, channel) {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", "saravrai.com");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", CAMPAIGN);
    url.searchParams.set("utm_content", `${channel}_${inboundSource}`);
    return url.toString();
  }

  function trackOutbound(channel) {
    if (typeof window.gtag === "function") {
      window.gtag("event", "outbound_channel_click", {
        channel: channel,
        campaign: CAMPAIGN,
        inbound_source: inboundSource,
      });
    }
  }

  function activateChannel(channel, url) {
    const pendingCard = document.querySelector(`[data-pending-channel="${channel}"]`);
    if (pendingCard) {
      const link = document.createElement("a");
      link.className = pendingCard.className.replace("is-pending", "").trim() + " channel-link";
      link.dataset.channel = channel;
      link.dataset.label = channel === "fanvue" ? "Entrar a Fanvue" : "Ver X";
      link.href = buildTrackedUrl(url, channel);
      link.innerHTML = pendingCard.innerHTML.replace("Se activa en el lanzamiento", "Disponible ahora ↗");
      pendingCard.replaceWith(link);
    }

    document.querySelectorAll(`.channel-link[data-channel="${channel}"]`).forEach((link) => {
      link.href = buildTrackedUrl(url, channel);
      if (link.dataset.label) link.textContent = link.dataset.label;
    });
  }

  Object.entries(CHANNELS).forEach(([channel, url]) => {
    if (url) activateChannel(channel, url);
  });

  document.addEventListener("click", function (event) {
    const link = event.target.closest(".channel-link");
    if (!link || !link.dataset.channel) return;
    const configuredUrl = CHANNELS[link.dataset.channel];
    if (!configuredUrl) {
      event.preventDefault();
      document.getElementById("canales").scrollIntoView({ behavior: "smooth" });
      return;
    }
    trackOutbound(link.dataset.channel);
  });

  confirmButton.addEventListener("click", function () {
    storageSet(AGE_KEY, "yes");
    unlock();
  });

  leaveButton.addEventListener("click", function () {
    window.location.replace("https://www.google.com/");
  });

  if (storageGet(AGE_KEY) === "yes") {
    unlock();
  } else {
    shell.setAttribute("aria-hidden", "true");
    shell.inert = true;
    window.setTimeout(function () { confirmButton.focus(); }, 50);
  }
})();
