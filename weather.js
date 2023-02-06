// const formJS = document.querySelectorAll("form")[0];

// const formJQ = jQuery("form");
const formJQ = $("form").eq(0);

// $(window).on("load",()=>console.log("jquery loaded"))

const inputJQ = $("input");

const msgJQ = $(".msg");

const listJQ = $(".ajax-section .cities");

// $(document).on("DOMContentLoaded",()=>{console.log("jquery dom is ready!")})
$(document).ready(() => {
  console.log("jquery dom is ready!");
});

// formJQ.on("submit",()=>{})
formJQ.submit((e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  const cityNameInput = inputJQ.val();
  const units = "metric";
  const lang = "eng";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=${units}&lang=${lang}`;
  //   const responce = await $.get(url);
  await $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: (response) => {
      console.log(response);
      const { main, sys, weather, name } = response;

      const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      // const cityCardList = listJQ.
      const cityCardList = listJQ.find(".city");
      const cityCardListArray = cityCardList.get();

      if (cityCardListArray.length > 0) {
        const filteredArray = cityCardListArray.filter(
          (card) => $(card).find("span").text() == name
        );
        if (filteredArray.length > 0) {
          msgJQ.text(
            `You already know the weather for ${name}, Please search for another city 😉`
          );
          msgJQ.css({ color: "red", "text-decoration": "underline" });
          msgJQ.css({ color: "red", "text-decoration": "underline" });
          setTimeout(() => {
            msgJQ.text("");
          }, 3000);
          formJQ.trigger("reset");
          return;
        }
      }
      const createdLi = $("<li></li>");
      createdLi.addClass("city");
      createdLi.html(
        `<h2 class="city-name" data-name="${name}, ${sys.country}">
                   <span>${name}</span>
                   <sup>${sys.country}</sup>
               </h2>
               <div class="city-temp">${Math.round(main.temp)}
                       <sup>°C</sup>
               </div>
               <figure>
                   <img class="city-icon" src="${iconUrlAWS}">
                   <figcaption>${weather[0].description}</figcaption>
               </figure>`
      );
      listJQ.prepend(createdLi);
      //formJQ[0].reset()
      formJQ.trigger("reset");

      $(".city").click((e) => {
        $(e.target)
          .animate({ left: "50px" })
          .animate({ left: "150px" })
          .animate({ left: "250px" })
          .animate({ left: "150px" })
          .animate({ left: "0px" });
      });

      $(".city img").click((e) => {
        $(e.target).slideUp(1500).slideDown(1500);
      });
      //
      //
    },
    beforeSend: (request) => {
      //add headers
      //send tokenKey
    },
    complete: () => {},
    error: (XMLHttpRequest) => {
      //error handling
      msgJQ.text(`${XMLHttpRequest.status} ${XMLHttpRequest.statusText}`);
      //styling
      msgJQ.css({ color: "red", "text-decoration": "underline" });
      setTimeout(() => {
        msgJQ.text(``);
      }, 3000);
      //             formJQ.trigger("reset");
    },
  });
};
