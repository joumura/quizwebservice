  String.prototype.htmlSpecialChars = function() {
      var result = this.replace(/</g, '&lt;');
      result = result.replace(/>/g, '&gt;');
      result = result.replace(/\"/g, '&quot;');
      result = result.replace(/\'/g, '&apos;');
      result = result.replace(/  /g, '&nbsp;');
      result = result.replace(/\r\n/g, '<br />');
      result = result.replace(/(\n|\r)/g, '<br />');
      return result;
  };

  $(quiz_display);

  function quiz_display() {
      $.ajax({
          type: "GET",
          url: "/quiz/Quiz.getTitles.json",
          data: "",
          dataType: "jsonp",
          success: function(titles) {
    	      for (var title in titles) {
                  $('#quiz_titles').append($('<option value="'
                		  + title + '">' + titles[title] + '</option>'));
    	      }
    	      $('#quiz_next').html("<input type=\"button\" id=\"quiz_reload\""
    	    		  + " value=\"next\" onclick=\"quiz_refresh();\""
    	    		  +	" style=\"border-style:none;\" />");
          },
          error: function(xhr, status, errorThrown) {
              $('#quiz_sentence').html("service not available.(" + status + ")");
          }
      });
      quiz_refresh();
  };
  function quiz_refresh() {
      $('#quiz_sentence').html("now loading...");
      $('#quiz_choices').html("");
      $.ajax({
          type: "GET",
          url: "/quiz/Quiz.getQuestion.json",
          data: "title=" + $('#quiz_titles option:selected').val(),
          dataType: "jsonp",
          success: function(question) {
              $('#quiz_sentence').html("(" + question.quizTitle + " : "
                 + question.groupName + ") " + question.sentence.htmlSpecialChars() + "<br />");
              for (i = 0, max = question.choices.length; i < max; i++) {
                  $('#quiz_choices').append(
                      "<input type=\"checkbox\" name=\"quiz_choice\" value=\""
                      + question.choices[i].correct + "\" />"
                      + question.choices[i].text.htmlSpecialChars() + "<br />");
              }
              $('#quiz_comment').val(question.comment.htmlSpecialChars());
              $('#quiz_submit').css("visibility", "visible");
          },
          error: function(xhr, status, errorThrown) {
              $('#quiz_sentence').html("service not available.(" + status + ")");
          }
      });
  };

  function quiz_answer() {
      var correct = true;
      $("input[name='quiz_choice']").each(
      function(i, elem) {
          if ((elem.checked == true && elem.value == "false")
              || (elem.checked == false && elem.value == "true")) {
              correct = false;
          }
      });

      if (correct) {
          $('#quiz_answer').html(
              "<span style=\"font-size:large;\">正解！(^^)/</span><br />"
              + $("#quiz_comment").val());
      } else {
          alert("不正解 (++)");
      }
  }
