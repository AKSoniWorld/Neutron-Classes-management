var connDB = require('../models/mysqlmodule.js');

exports.removerQuest   = 	function(req, res){
      var questoes = [];
      var qry =  "DELETE FROM `questoes` WHERE cod_quest = '"+ req.body.codigo_quest +"'" ;
      connDB.query(qry,function(err,rows){
        if (err)
        req.flash('MSGCadQuest', err);
        else {
          console.log("Deletado! ");
        }
      });
};

exports.SaveNts = function(req,res){
  var dados = [];
  var qryDEL = "DELETE FROM lembretes WHERE user = '"+req.user.matricula+"'";
  console.log("AQUI");
  console.log(req.body.obj[1]);
  connDB.query(qryDEL, function(err,rows){if(err)console.log("erro ao dar delete no banco:"+err);}); 
  for (var i=0; i< req.body.obj.length ; i++){
    var qry = "INSERT INTO `lembretes`( `user`, `content`)  VALUES ('"+req.user.matricula+"','"+req.body.obj[i]+"')";
       connDB.query(qry,function(err,rows){
       if (err) console.log(err);
    });
  }
    return res.ok();

  console.log("NOTAS SALVAS");

};
exports.DelNts  = function (req,res){
    console.log(req.body);
    var qryDEL = "DELETE FROM lembretes WHERE user = '"+req.user.matricula+"' AND ID='"+req.body.obj+"'";
    connDB.query(qryDEL, function(err,rows){if(err)console.log("erro ao dar delete no banco:"+err);}); 

}
exports.LoadNts = function(req,res){
  var dados = [];
  console.log("MUSICA DE BARAO");
  var qry ="SELECT ID,content FROM lembretes WHERE user = '"+req.user.matricula+"'";
  console.log(qry);
  connDB.query(qry,function(err,rows){
    if(err) console.log(err);
  if (rows.length) {
    for (var i = 0, len = rows.length; i < len; i++) {
      dados.push([rows[i].content,rows[i].ID]);
      // console.log(dados[i]);
    }
    // console.log(dados);
  }
    res.json(dados);

  });
};
exports.GetNotas = function(req,res){
  var aluno_data_turma=[];
  console.log("MUSICA DE HAUSHDUASHDUASDUSAD");
  var sql="SELECT DISTINCT turma.cod_turma FROM turma, prof_turma WHERE matricula = '"+req.user.matricula+"' AND turma.cod_turma = prof_turma.cod_turma";
  connDB.query(sql,function(err,rows){
    if (rows.length) {
      for (var i = 0, len = rows.length; i < len; i++) {
        aluno_data_turma.push([rows[i].cod_turma]);
      }
      console.log("====================================");
      console.log("====================================");
      console.log("====================================");
      console.log("====================================");
      console.log(aluno_data_turma);
      var aluno_data = [];
      var sql2="SELECT nota FROM prof_turma, aluno_nota  WHERE prof_turma.matricula = '"+req.user.matricula+"' AND prof_turma.cod_turma ='"+aluno_data_turma+"' ";
      console.log(sql2);
      connDB.query(sql2,function(err,rows){
        if(err){ 
          console.log("errrrou"+ err);
        }
        if (rows.length) {
          for (var i = 0, len = rows.length; i < len; i++) {
            aluno_data.push([rows[i].nota]);
          }
          console.log(aluno_data);
          res.json(aluno_data);
        }
      });
      // res.json(aluno_data); 
    }
  });
};
exports.pesquisateste   =   function(req, res){
  var x = 0; // Variável pra controlar o número de condições 0 = Nenhuma condição
  console.log(req.body.autor + req.body.nivel + req.body.tipo + req.body.disciplina + req.body.materia + req.body.creation + req.body.serie);
  //Cria a condição WHERE de autor
  if(req.body.autor == '' || req.body.autor == null || req.body.autor == undefined){

    var condicaoAutor = "";

  }
  else {
    var condicaoAutor = " autor= '" + req.body.autor + "'";
    x++;
  }

  //Cria a condição WHERE de nível
  if(req.body.nivel == '' || req.body.nivel == null || req.body.nivel == undefined || req.body.nivel == 'Nível'){
    var condicaoNivel = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoNivel = " AND";}
    else {var condicaoNivel = "";}
    condicaoNivel += " nivel= '" + req.body.nivel + "'";
    x++;
  }

  //Cria a condição WHERE de tipo
  if(req.body.tipo == '' || req.body.tipo == null || req.body.tipo == undefined || req.body.tipo == 'Tipo'){
    var condicaoTipo = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoTipo = " AND";}
    else {var condicaoTipo = "";}
    condicaoTipo += " tipo = '"+ req.body.tipo +"'";
    x++;
  }

  //Cria a condição WHERE de disciplina
  if(req.body.disciplina == '' || req.body.disciplina == null || req.body.disciplina == undefined || req.body.disciplina == 'Disciplina'){
    var condicaoDisciplina = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoDisciplina = " AND";}
    else {var condicaoDisciplina = "";}
    condicaoDisciplina += " disciplina_id = (SELECT `disciplina_id` FROM `disciplinas` WHERE disciplina_nome = '"+ req.body.disciplina +"')";
    x++;
  }

  //Cria a condição WHERE de matéria
  if(req.body.materia == '' || req.body.materia == null || req.body.materia == undefined || req.body.materia == 'Matéria'){
    var condicaoMateria = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoMateria = " AND";}
    else {var condicaoMateria = "";}
    condicaoMateria += " materia_id = (SELECT `materia_id` FROM `materia` WHERE nome = '"+ req.body.materia +"')";
    x++;
  }

  //Cria a condição WHERE de ano de criação
  if(req.body.creation == '' || req.body.creation == null || req.body.creation == undefined){
    var condicaoAno = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoAno = " AND";}
    else {var condicaoAno = "";}
    condicaoAno += " ano_letivo = '"+ req.body.creation +"'";
    x++;
  }

  //Cria a condição WHERE de série
  if(req.body.serie == '' || req.body.serie == null || req.body.serie == undefined || req.body.serie == 'Série'){
    var condicaoSerie = "";
  }
  else {
    //Testa se já tem alguma outra condição
    if(x>0) {var condicaoSerie = " AND";}
    else {var condicaoSerie = "";}
    condicaoSerie += " anoserie = '"+ req.body.serie +"'";
  }

  // Testa se tem alguma condição
  if(x>0){
    var whereClause = "WHERE";
  }
  else {
    var whereClause = "";
  }


  var questoes = [];
  var qry =  "SELECT questoes.enunciado, questoes.gabarito, questoes.cod_quest FROM questoes "+ whereClause + condicaoAutor + condicaoNivel + condicaoTipo + condicaoDisciplina + condicaoMateria + condicaoAno + condicaoSerie +" GROUP BY enunciado" ;
  console.log(qry);
  connDB.query(qry,function(err,rows){
    if (err)
    req.flash('MSGCadQuest', err);
    if (rows.length) {

      for (var i = 0, len = rows.length; i < len; i++) {
        questoes.push([rows[i].enunciado, rows[i].gabarito, rows[i].cod_quest ]);
      }

      console.log(questoes);
      res.json(questoes);
    }
  });
};

exports.listalunos	=	function(req, res){

  var listaalunos = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  var qry = "select nome, aluno.matricula from aluno, turma_aluno where cod_turma = '"+req.body.nometurma+"' AND aluno.matricula=turma_aluno.matricula ORDER BY nome";
  connDB.query(qry,function(err,rows){
    for (var i = 0, len = rows.length; i < len; i++)
      {
        //console.log()
        //listaalunos.push(rows[i].nome);
        listaalunos.push([rows[i].nome, rows[i].matricula]);
        //nunes, é aqui que deveria pegar os nomes ? sim, e jogar na array tbm. vejamos cod_turma nao é nome..... mt bem observado
         }
  res.json(listaalunos);

  });


};

exports.pesquisaturma	=	function(req, res){

  var consulTurmas = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  var sql= "select distinct cod_turma from prof_turma where matricula = '"+req.user.matricula+"'  ";
  connDB.query(sql,function(err,rows){
    if (err) console.log(err);
    for (var i = 0, len = rows.length; i < len; i++)
      {

        consulTurmas.push(rows[i].cod_turma);
      }
      console.log(consulTurmas);
      console.log(sql);
      console.log("++++++++++++++++++++++++++++++++++++++++++++");

      console.log("++++++++++++++++++++++++++++++++++++++++++++");
      console.log("++++++++++++++++++++++++++++++++++++++++++++");
      console.log("++++++++++++++++++++++++++++++++++++++++++++");

      console.log("++++++++++++++++++++++++++++++++++++++++++++");
      console.log("++++++++++++++++++++++++++++++++++++++++++++");
  res.json(consulTurmas);

  });


};
exports.pesquisaDiscProf = function(req, res){

  var consulDisc = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  connDB.query("select disciplina from prof_turma where matricula = '"+req.body.matricula+"' ",function(err,rows){
    for (var i = 0, len = rows.length; i < len; i++)
      {
       
        consulDisc.push( rows[i].disciplina );
      } 
      console.log(consulDisc);
  res.json(consulDisc);

  });


};

exports.provaquests = function(req, res){

  var consulquests = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  var consultipos =[];
  var izao  =[];

      connDB.query("select questoes.tipo,questoes.cod_quest,enunciado, op1,op2,op3,op4,op5 from questoes, prova_questoes where prova_questoes.cod_prova = '"+ req.body.variola +"' AND questoes.cod_quest = prova_questoes.cod_quest  ",function(err,rows){
        for (var i = 0, len = rows.length; i < len; i++)
          {
            var tmp = {};
            tmp['tipo'] =rows[i].tipo;
            tmp['cod_quest'] =rows[i].cod_quest;
            tmp['enunciado'] = rows[i].enunciado;
            tmp['op1'] = rows[i].op1;
            tmp['op2'] = rows[i].op2;
            tmp['op3'] = rows[i].op3;
            tmp['op4'] = rows[i].op4;
            tmp['op5'] = rows[i].op5;

            izao.push(tmp);
      }

      res.json(izao);

  });
};

exports.pegaPresenca   =   function(req, res){

      var dadosTable = [];
      var data= req.body.txtSelectedDate;
      var datasplit = data.split("/");
      var dataFormatada = datasplit[2] +'-'+ datasplit[1] +'-'+ datasplit[0];

      
      var qry = "select nome, aluno.matricula, presente, comentario,prof_diario.cod_aula  FROM aluno, turma_aluno, prof_diario_aluno,prof_diario            where cod_turma = '"+req.body.nometurma+"'and prof_diario.matricula='"+req.user.matricula+"' and cod_turma=prof_diario.turma             AND aluno.matricula=turma_aluno.matricula and  aluno.matricula =  prof_diario_aluno.matricula            and  prof_diario.data = '"+ dataFormatada +"'      and prof_diario.turma='"+req.body.nometurma+"'       and prof_diario.matricula ='"+req.user.matricula+"'                            AND      prof_diario.turma='"+req.body.nometurma+"'      and prof_diario.cod_aula=prof_diario_aluno.cod_aula ORDER BY nome";
       connDB.query(qry,function(err,rows){
         if (err)
         req.flash('MSGCadQuest', err);
         if (rows.length) {

                  for (var i = 0, len = rows.length; i < len; i++) {
                     dadosTable.push([rows[i].nome, rows[i].matricula, rows[i].presente,rows[i].comentario ]);
                  }
                     dadosTable.push([rows[0].comentario ]);

                  console.log(dadosTable);
                  res.json(dadosTable);
         }
         else{


  var listaalunos = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  var qry2 = "select nome, aluno.matricula from aluno, turma_aluno where cod_turma = '"+req.body.nometurma+"' AND aluno.matricula=turma_aluno.matricula ORDER BY nome";
  connDB.query(qry2,function(err,rows){
    for (var i = 0, len = rows.length; i < len; i++)
      {
        //console.log()
        //listaalunos.push(rows[i].nome);
        listaalunos.push([rows[i].nome, rows[i].matricula]);

        //nunes, é aqui que deveria pegar os nomes ? sim, e jogar na array tbm. vejamos cod_turma nao é nome..... mt bem observado
            }
                     listaalunos.push(['  ']);

  res.json(listaalunos);

  });



         }
       });
};

exports.consulProva = function(req, res){

  var listaalunos = [];  // AQUI FOI CRIADO UM ARRAY QUE VAI COMPORTAR OS RESULTADOS .
  var qry = "SELECT cod_prova, provas.tipo_avaliacao, provas.anoserie  FROM provas, profs,disciplinas WHERE disciplinas.disciplina_nome = '" + req.body.disciplina + "' AND disciplinas.disciplina_id= provas.cod_disciplina AND provas.anoserie = '" + req.body.serie + "'AND tipo_avaliacao = '" + req.body.tipo + "' AND provas.matricula IN (SELECT matricula FROM profs where nome = '" + req.body.autor + "' )";
  connDB.query(qry,function(err,rows){
      for (var i = 0, len = rows.length; i < len; i++)
        {
          //console.log()
          //listaalunos.push(rows[i].nome);
        listaalunos.push([rows[i].cod_prova, rows[i].tipo_avaliacao, rows[i].anoserie]);

            }
  res.json(listaalunos);

  });


};
/*----------------- calendario ----------------------*/
exports.pesquisaEvento  = function(req, res){
  console.log("\ncolsulta eventos pedido");
  var eventos = [];    
  var qry = "SELECT  `cod_evento`, `evento`, `descricao`, `datahora`, `cor`, `cor2`,`turma`,`datafim`, `allday` FROM `calendario` WHERE `matricula`='"+req.user.matricula+"' ORDER BY datahora DESC  ";
  connDB.query(qry,function(err,rows){
    for (var i = 0, len = rows.length; i < len; i++)
    {                 
        eventos.push({
          cod_evento  : rows[i].cod_evento,
          title       : '',
          titulo      : rows[i].evento,           
          descricao   : rows[i].descricao,
          startsAt    : rows[i].datahora,
          endsAt      : rows[i].datafim,
          allday      : rows[i].allday,
          turma       : rows[i].turma,  
          actions     : '',
          cor         : '',
          color:{
            primary   : rows[i].cor,
            secondary : rows[i].cor2 
          }
        });
    }   
    res.json(eventos);
    //console.log(eventos+"\n"+qry);
    console.log("   consulta evento entregue \n");
  });
};

/*----------------ADM__pesquisa------------------*/
exports.ADMpesquisaDisc = function(req,res){
  console.log("\ncolsulta ADM dics inicio");

  var consulDisc = [];
  connDB.query("SELECT DISTINCT `disciplina_nome`  FROM `disciplinas` ",function(err,rows){
  for (var i = 0, len = rows.length; i < len; i++)
  {   
    consulDisc.push( rows[i].disciplina_nome ); //+"-"+rows[i].anoserie 
  } 
  //console.log(consulDisc);
  res.json(consulDisc);
  });

  console.log("\tcolsulta ADM disc fim\n");
};

exports.ADMpesquisaMateria = function(req,res){
};

exports.ADMpesquisaturma = function(req,res){
  console.log("\ncolsulta ADM turmas inicio");
  var consulTurmas = []; 
  connDB.query(" SELECT `cod_turma`, `anoserie` FROM `turma` ",function(err,rows){
  for (var i = 0, len = rows.length; i < len; i++)
  {
    consulTurmas.push(rows[i].cod_turma);  //+"-"+rows[i].anoserie    
  }
  //console.log(consulTurmas);
  res.json(consulTurmas);
  });

  console.log("\tcolsulta ADM turmas fim\n");
};  

exports.ADMpesquisaProf = function(req,res){
  console.log("\ncolsulta ADM profs inicio");

  var nomes = [];
  connDB.query("SELECT `nome` FROM `profs` ",function(err,rows){
  for (var i = 0, len = rows.length; i < len; i++)
  {   
    nomes.push( rows[i].nome ); //+"-"+rows[i].anoserie 
  } 
  //console.log(nomes);
  res.json(nomes);
  });

  console.log("\tcolsulta ADM profs fim\n");  
};



/*----------------ADM__cadastro------------------*/
exports.ADMCadDisc = function(req,res){
  console.log("\cadastrado disciplina - inicio ");

  //var matricula= request.user.matricula;
  var materia = req.body.AddDisc_disciplina;
  var serie   = req.body.AddDisc_serie;

  var qry = "INSERT INTO `disciplinas`(`disciplina_nome`, `anoserie`) VALUES ('"+materia+"','"+serie+"')";  
  connDB.query(qry,function(err,rows){
    if (err){ req.flash('MSGCadQuest', err);}
    else { console.log("\tcadastrado disciplina - fim\n");}
  }); 
  
  // return res.render('paginas/teste', {message: req.flash('MSGCadQuest','Dados Gravados Com sucesso'), user: request.user.username});
};

exports.ADMCadMateria = function(req,res){ 
  console.log("\cadastrado disciplina - inicio");


  var materia = req.body.addMateria_meteria;
  var disc    = req.body.addMateria_disciplina;
  var serie   = req.body.addMateria_serie;
  var descr   = req.body.addMateria_descri;
  var disc_id;
  /* procurar o desciplina_id*/  


  connDB.query("SELECT disciplina_id FROM disciplinas WHERE disciplina_nome='"+disc+"' and disciplinas.anoserie ='"+serie+"'",function(err,rows){
  for (var i = 0, len = rows.length; i < len; i++) 
    {
      disc_id.push( rows[i].disciplina_id);
       console.log(disc_id);
    }
  });

  /*cadastra a materia*/
  var inser = "INSERT INTO `materia`(`nome`, `descricao`, `disciplina_id`) VALUES ('"+materia+"','"+descr+"','"+disc_id+"')"; 
  console.log(inser); 
  connDB.query(inser,function(err,rows){ 
      if (err){ console.log(err);}
      else { console.log("\tcadastrado disciplina - fim\n");}
  })
};

exports.ADMCadturma = function(req,res){ 
  console.log("\cadastrado disciplina - inicio ");

  console.log("\tcadastrado disciplina - fim\n");
};

exports.ADMCadProf = function(req,res){ 
  console.log("\cadastrado disciplina - inicio ");

  console.log("\tcadastrado disciplina - fim\n");
};




//     var lines = process.stdout.getWindowSize()[1];
//      for(var i = 0; i < lines; i++) {
//          console.log('\r\n');
//          console.log('\r\n');
//          console.log('\r\n');
//
//      }