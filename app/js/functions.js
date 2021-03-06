(function ($) {
  $.fn.viacep = function () {
    $(this).each(function (index, el) {
      var $this = $(el);
      var cep = $this.find('.cep');
      var uf = $this.find('.uf');
      var cidade = $this.find('.cidade');
      var bairro = $this.find('.bairro')
      var rua = $this.find('.rua');
      var ibge;
      cep.blur(function () {
        //Nova variável "cep" somente com dígitos.
        cep = $(this).val().replace(/\D/g, '');
        //Verifica se campo cep possui valor informado.
        if (cep != "") {
          //Expressão regular para validar o CEP.
          var validacep = /^[0-9]{8}$/;
          //Valida o formato do CEP.
          if (validacep.test(cep)) {
            //Preenche os campos com "..." enquanto consulta webservice.
            rua.val("...");
            bairro.val("...");
            cidade.val("...");
            uf.val("...");
            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
              if (!("erro" in dados)) {
                //Atualiza os campos com os valores da consulta.
                rua.val(dados.logradouro);
                bairro.val(dados.bairro);
                cidade.val(dados.localidade);
                uf.val(dados.uf);
              } //end if.
              else {
                //CEP pesquisado não foi encontrado.
                // Limpa valores do formulário de cep.
                rua.val("");
                bairro.val("");
                cidade.val("");
                uf.val("");
                // ibge.val("");
                alert("CEP não encontrado.");
              }
            });
          } //end if.
          else {
            //cep é inválido.
            rua.val("");
            bairro.val("");
            cidade.val("");
            uf.val("");
            alert("Formato de CEP inválido.");
          }
        } //end if.
        else {
          //cep sem valor, limpa formulário.
          rua.val("");
          bairro.val("");
          cidade.val("");
          uf.val("");
        }
      });
    });
  };
})(jQuery);

function form_clear() {
  var form = $(".formulario");
  form.each(function (index, el) {
    var this_form = $(el);
    this_form.find('input').each(function (index, el) {
      var input = $(this);
      input.val("");
      if (input.hasClass('uk-form-success')) input.removeClass('uk-form-success');
      if (input.hasClass('uk-form-danger')) input.removeClass('uk-form-danger');
    });
  });
}

function load_cursos() {
  var input = $("select[name=faculdade]");
  var label = $("label[name=faculdade_registro]");
  var value = input.val()
  var select_name = $("[name=faculdade] :selected").text().split("Selecionar");
  select_name = select_name[0];
  console.log(select_name);
  if (select_name=="FACIMED") {
    label.html("CPF");
    $("[name=registroAcademico]").attr("maxlength", "11");
  } else if(select_name=="UNESC") {
    $("[name=registroAcademico]").attr("maxlength", "9");
    label.html("RA");
  }
  $("[name=registroAcademico]").val("");
  $.ajax({
      url: '../controller/ajax_load_cursos.php',
      type: 'POST',
      data: {
        faculdade: value
      }
    })
    .done(function (response) {
      $("[name=curso]").html("");
      $('[name=curso]').html("<option value='0' selected hidden>Selecionar Curso</option>");
      $("[name=curso]").append(response);

    })
    .fail(function () {
      console.log("error");
    });
}

function load_periodos() {
  var curso = $("select[name=curso]").val();
  $.ajax({
      url: '../controller/ajax_load_periodos.php',
      type: 'POST',
      data: {
        curso: curso
      }
    })
    .done(function (response) {
      // console.log(response);
      $('[name=periodo]').html("");
      $('[name=periodo]').html("<option value='0' selected hidden>Selecionar Periodo</option>");
      $("[name=periodo]").append(response);
    })
    .fail(function () {
      console.log("error");
    });
}

function build_mask_all() {
  $("[name=cpf]").mask('000.000.000-00', {
    reverse: true
  });
  $(".celular").mask('(00) 90000-0000');
  $(".fixo").mask('(00) 0000-0000');
  $(".zero").mask('0000 000-0000');
  $("[name=dataNasc]").mask('00/00/0000', {
    placeholder: 'DD/MM/YYYY'
  });
  $("[name=cnpj]").mask('00.000.000/0000-00', {
    reverse: true
  });
}

function isDate() {
  var form = $('.formulario');
  form.each(function (index, el) {
    var this_form = $(el);
    var input_data = this_form.find('[name=dataNasc]');
    input_data.blur(function (event) {
      dateStr = input_data.val();
      var parts = dateStr.split("/");
      var data = new Date(parts[2], parts[1] - 1, parts[0]);
      console.log(data);
    });
  });
}

function check_termos() {
  var chk_termos = $(".formulario").find("[name=termos]");
  var btn_enviar = $(".formulario").find("[name=btn_enviar]");
  chk_termos.click(() => {
    if (chk_termos.is(':checked')) {
      btn_enviar.removeClass('uk-disabled');
      btn_enviar.addClass('uk-button-primary');
    } else {
      btn_enviar.removeClass('uk-button-primary');
      btn_enviar.addClass('uk-disabled');
    }
  });
}

function validate_inputs(form) {
  var res = false;
  form.find('input').each(function (index, el) {
    var name = $(this).attr('name');
    var value = $(this).val();
    var arr = ["telefone2","telefone1", "email"];
    if (name != "termos") {
      if (!arr.includes(name)) {
        if ($(this).hasClass('uk-form-danger') || (value == "")) {
          $(this).addClass('uk-form-danger');
          res = true;
        }
      }
    }
  });
  return res;
}

function form_login() {
  var form = $(".formulario-login");
  var btn_logar = form.find("[name=btn_logar]");
  btn_logar.click(function (event) {
    var data_login = {};
    data_login['usuario'] = form.find('[name=usuario]').val();
    data_login['senha'] = form.find('[name=senha]').val();
    $.ajax({
      url: '../controller/ajax_sessao_logar.php',
      type: 'POST',
      data: data_login,
      success: (data) => {
        console.log(data);
        location.href = "http://localhost:8080/";
      },
      error: () => {
        console.log("error");
      }
    });
  });
}

function form_submit() {
  var form = $(".formulario");
  form.each(function (index, el) {
    var this_form = $(el);
    var btn_enviar = this_form.find("[name=btn_enviar]");
    var form_name = this_form.attr('name');
    btn_enviar.click(() => {
      if (validate_inputs(this_form)) {
        notification(
          "<p class=\"uk-text-center\">Alguns campos estão nulos. Preencha-os corretamente.</p>",
          'warning',
          'top-left',
          1500
        );
      } else {
        var formData = new FormData(el);
        formData.append('classe', form_name);
        $.ajax({
          url: '../controller/ajax_submit.php',
          type: 'POST',
          contentType: false,
          processData: false,
          data: formData,
          success: (data) => {
            notification(
              "<p class=\"uk-text-center\">Formulário Enviado</p>",
              'success',
              'top-center',
              2000
            );
            console.log(data);
            setTimeout(function () {
              location.reload();
            }, 1500);
          },
          error: () => {
            console.log("error");
          }
        });
      }
    });


  });
}

function check_passwords() {
  var form = $(".formulario");
  form.each(function (index, el) {
    var $this = $(el);
    var input_s1 = $this.find("[name=senha1]");
    var input_s2 = $this.find("[name=senha2]");
    input_s2.blur(function (event) {
      /* Act on the event */
      var senha1 = input_s1.val();
      var senha2 = input_s2.val();
      if (senha1 != senha2) {
        if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
        if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
        input_s1.addClass('uk-form-danger');
        input_s2.addClass('uk-form-danger');
        input_s1.attr('uk-tooltip', 'title: As senhas as não se confere; pos: bottom;');
        input_s2.attr('uk-tooltip', 'title: As senhas as não se confere; pos: bottom;');
      } else {
        if ((senha1 == "") && (senha2 == "")) {
          if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
          if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
          input_s1.addClass('uk-form-danger');
          input_s2.addClass('uk-form-danger');
        } else if ((senha1.length < 8) && (senha2.length < 8)) {
          if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
          if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
          input_s1.addClass('uk-form-danger');
          input_s2.addClass('uk-form-danger');
          input_s1.attr('uk-tooltip', 'title: Senha muito curta. Deve conter ao menos 8 caracteres; pos: bottom;');
          input_s2.attr('uk-tooltip', 'title: Senha muito curta. ; pos: bottom;');
        } else {
          if (input_s1.hasClass('uk-form-danger')) input_s1.removeClass('uk-form-danger');
          if (input_s2.hasClass('uk-form-danger')) input_s2.removeClass('uk-form-danger');
          input_s1.addClass('uk-form-success');
          input_s2.addClass('uk-form-success');
          input_s1.removeAttr("uk-tooltip");
          input_s2.removeAttr("uk-tooltip");
        }
      }
    });
    input_s1.blur(function (event) {
      /* Act on the event */
      var senha1 = input_s1.val();
      var senha2 = input_s2.val();
      if (senha1 != senha2) {
        if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
        if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
        input_s1.addClass('uk-form-danger');
        input_s2.addClass('uk-form-danger');
        input_s1.attr('uk-tooltip', 'title: As senhas as não se confere; pos: bottom;');
        input_s2.attr('uk-tooltip', 'title: As senhas as não se confere; pos: bottom;');
      } else {
        if ((senha1 == "") && (senha2 == "")) {
          if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
          if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
          input_s1.addClass('uk-form-danger');
          input_s2.addClass('uk-form-danger');
        } else if ((senha1.length < 8) && (senha2.length < 8)) {
          if (input_s1.hasClass('uk-form-success')) input_s1.removeClass('uk-form-success');
          if (input_s2.hasClass('uk-form-success')) input_s2.removeClass('uk-form-success');
          input_s1.addClass('uk-form-danger');
          input_s2.addClass('uk-form-danger');
          input_s1.attr('uk-tooltip', 'title: Senha muito curta; pos: bottom;');
          input_s2.attr('uk-tooltip', 'title: Senha muito curta; pos: bottom;');
        } else {
          if (input_s1.hasClass('uk-form-danger')) input_s1.removeClass('uk-form-danger');
          if (input_s2.hasClass('uk-form-danger')) input_s2.removeClass('uk-form-danger');
          input_s1.addClass('uk-form-success');
          input_s2.addClass('uk-form-success');
          input_s1.removeAttr("uk-tooltip");
          input_s2.removeAttr("uk-tooltip");
        }
      }
    });
  });
}

function check_null_fields() {
  var form = $(".formulario");
  form.each(function (index, el) {
    $(el).find('input').each(function (index, el) {
      var input = $(this);
      $(this).blur(function (event) {
        var value = input.val();
        var name = input.attr('name');
        var arr = ["telefone2","telefone1", "email"];
        /* Act on the event */
        if (!arr.includes(name)) {
          if (value == "") {
            input.addClass('uk-form-danger');
            input.attr('uk-tooltip', 'title: Preencha este campo; pos: bottom;');
          } else {
            input.removeClass('uk-form-danger');
            input.removeAttr('uk-tooltip');
          }
        }
      });
    });
  });
}

function notification(text, sts, pos, time) {
  UIkit.notification({
    message: text,
    status: sts,
    pos: pos,
    timeout: time
  });
}

function check_user_exists() {
  var form = $(".formulario");
  form.each(function (index, el) {
    var input_usuario = $(el).find('[name=usuario]');
    input_usuario.blur(function (event) {
      if (!(input_usuario.val() == "")) {
        var value = input_usuario.val();
        $.ajax({
            url: '/controller/ajax_check_user.php',
            type: 'POST',
            data: {
              'usuario': value
            }
          })
          .done(function (res) {
            console.log(res);
            if (res) {
              if (input_usuario.hasClass('uk-form-success')) input_usuario.removeClass('uk-form-success');
              input_usuario.addClass('uk-form-danger');
              input_usuario.attr('uk-tooltip', "title: Este usuario jś esta cadastrado; pos: right;");
            } else {
              input_usuario.addClass('uk-form-success');
            }
          })
          .fail(function () {
            console.log("error");
          });
      } else {
        if (input_usuario.hasClass('uk-form-success')) input_usuario.removeClass('uk-form-success');
        input_usuario.addClass('uk-form-danger');
      }
    });
  });
}

function session() {
  var btn_deslogar = $('[name=encerrar_sessao]');
  btn_deslogar.click(() => {
    $.ajax({
      url: '/controller/ajax_sessao_end.php',
      success: () => {
        location.href = "http://localhost:8080/";
      }
    });
  });

}
