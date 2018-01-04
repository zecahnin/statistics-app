
exports.up = function(knex, Promise) {
  var queryAcesso = 'CREATE OR REPLACE VIEW vw_objeto_acesso_statics AS ' +
    'SELECT ' +
    ' pel_conteudo_acesso.id                 AS id, ' +
    ' pel_conteudo_acesso.dt_criacao          AS dt_criacao, ' +
    ' pel_conteudo_acesso.praticaEducativaId  AS praticaEducativaId,' +
    ' pel_conteudo_acesso.usuarioId           AS usuarioId, ' +
    ' pel_conteudo_acesso.objetoEducacionalId AS objeto ' +
    ' FROM ' +
    ' pel_conteudo_acesso ' +
    ' UNION ' +
    ' ALL  ' +
    ' SELECT ' +
    ' pel_conteudo_acesso.id                   AS id, ' +
    ' pel_conteudo_acesso.dt_criacao            AS  dt_criacao, ' +
    ' pel_conteudo_acesso.praticaEducativaId    AS  praticaEducativaId, ' +
    ' pel_conteudo_acesso.usuarioId             AS  usuarioId, ' +
    ' pel_conteudo_acesso.objetoInformacionalId AS objeto  ' +
    'FROM ' +
    ' pel_conteudo_acesso  ' +
    ' WHERE ' +
    ' (pel_conteudo_acesso.objetoInformacionalId IS NOT NULL)  ' +
    'UNION ' +
    ' ALL  ' +
    'SELECT ' +
    ' pel_conteudo_acesso.id                   AS id, ' +
    ' pel_conteudo_acesso.dt_criacao            AS  dt_criacao,' +
    ' pel_conteudo_acesso.praticaEducativaId    AS  praticaEducativaId, ' +
    ' pel_conteudo_acesso.usuarioId             AS  usuarioId, ' +
    ' pel_conteudo_acesso.elementoEducacionalId AS objeto ' +
    'FROM ' +
    ' pel_conteudo_acesso ' +
    ' WHERE ' +
    ' (pel_conteudo_acesso.elementoEducacionalId IS NOT NULL) ' +
    'UNION ' +
    ' ALL  ' +
    ' SELECT ' +
    ' pe.id                  AS id, ' +
    ' pe.dt_criacao           AS dt_criacao, ' +
    ' pe.id                   AS praticaEducativaId, ' +
    ' pe.usuarioId            AS usuarioId, ' +
    ' pe.objetoAprendizagemId AS objeto ' +
    'FROM ' +
    ' (pel_pratica_educativa pe ' +
    ' JOIN pel_objeto_aprendizagem ao ' +
    ' ON(((pe.objetoAprendizagemId = ao.id) AND ' +
    ' (ao.objetoAprendizagemTipoId = 4)))); ';

  var queryDadosDesnomalizado = 'CREATE OR REPLACE VIEW dados_desnomalizado AS ' +
    'SELECT' +
    ' woa.id                AS id,' +
    ' woa.praticaEducativaId AS praticaEducativaId,' +
    ' (' +
    ' CASE ' +
    ' WHEN (pe.progresso_percentual BETWEEN 0 AND' +
    ' 24) ' +
    ' THEN \'0% até 24%\' ' +
    ' WHEN (pe.progresso_percentual BETWEEN 25 AND' +
    ' 74) ' +
    ' THEN \'25% até 74%\' ' +
    ' WHEN (pe.progresso_percentual BETWEEN 75 AND' +
    ' 99) ' +
    ' THEN \'75% até 99%\' ' +
    ' WHEN (pe.progresso_percentual = 100) ' +
    ' THEN \'100%\' ' +
    ' END)                  AS conclusao,' +
    ' (' +
    ' CASE ' +
    ' WHEN (CAST(pe.dt_criacao AS TIME) BETWEEN \'00:00:00\' AND' +
    ' \'05:59:59\') ' +
    ' THEN \'MADRUGADA\' ' +
    ' WHEN (CAST(pe.dt_criacao AS TIME) BETWEEN \'06:00:00\' AND' +
    ' \'11:59:59\') ' +
    ' THEN \'MANHÃ\' ' +
    ' WHEN (CAST(pe.dt_criacao AS TIME) BETWEEN \'12:00:00\' AND' +
    ' \'17:59:59\') ' +
    ' THEN \'TARDE\' ' +
    ' WHEN (CAST(pe.dt_criacao AS TIME) BETWEEN \'18:00:00\' AND' +
    ' \'23:59:59\') ' +
    ' THEN \'NOITE\' ' +
    ' END)                  AS periodo,' +
    ' (' +
    ' CASE ' +
    ' WHEN isnull(pu.lastUpdated) ' +
    ' THEN \'NOVO\' ' +
    ' WHEN (pu.lastUpdated IS NOT NULL) ' +
    ' THEN \'ATIVO\' ' +
    ' END)                  AS tipo_usuario,' +
    ' pe.dt_criacao          AS dt_acesso,' +
    ' woa.usuarioId          AS usuarioId,' +
    ' pu.created             AS dt_cadastro,' +
    ' pu.lastUpdated         AS dt_atualização,' +
    ' pu.nome                AS nome,' +
    ' pu.sexo                AS sexo,' +
    ' pu.dt_nascimento       AS dt_nascimento,' +
    ' YEAR(from_days((to_days(now()) - to_days(pu.dt_nascimento))))        AS idade,' +
    ' est.sigla              AS estado,' +
    ' muni.nome              AS municipio,' +
    ' woa.objeto             AS objeto,' +
    ' oa.titulo              AS titulo,' +
    ' oat.id                 AS tipo_id,' +
    ' oat.nome               AS tipo,' +
    ' oam.nome               AS midia ' +
    ' FROM ' +
    '(((((((vw_objeto_acesso_statics woa ' +
    ' JOIN pel_objeto_aprendizagem oa ' +
    ' ON((woa.objeto = oa.id))) ' +
    ' JOIN pel_objeto_aprendizagem_tipo oat ' +
    ' ON((oat.id = oa.objetoAprendizagemTipoId))) ' +
    ' JOIN pel_objeto_aprendizagem_midia oam ' +
    ' ON((oam.id = oa.objetoAprendizagemMidiaId))) ' +
    ' JOIN pel_pratica_educativa pe ' +
    ' ON((pe.id = woa.praticaEducativaId))) ' +
    ' JOIN pel_usuario pu ' +
    ' ON((pu.id = woa.usuarioId))) ' +
    ' LEFT JOIN pel_municipio muni ' +
    ' ON((muni.id = pu.municipioId))) ' +
    ' LEFT JOIN pel_estado est ' +
    ' ON((muni.estadoId = est.id)));'

  var queryTags = 'CREATE OR REPLACE VIEW vw_tags AS ' +
    'SELECT ' +
    ' tag.nome                   AS nome, ' +
    ' voa.dt_criacao              AS dt_criacao,' +
    ' voa.id                      AS item,' +
    ' oa.objetoAprendizagemTipoId AS objetoAprendizagemTipoId ' +
    'FROM' +
    '(((pel_tag tag ' +
    ' JOIN pel_objeto_aprendizagem_tag atag ' +
    ' ON((atag.tagId = tag.id))) ' +
    ' JOIN vw_objeto_acesso_statics voa ' +
    ' ON(((atag.objetoAprendizagemId = voa.objeto) AND ' +
    ' (voa.usuarioId NOT IN (2,3,4,5,6,7,8,9,10))))) ' +
    ' JOIN pel_objeto_aprendizagem oa ' +
    ' ON((voa.objeto = oa.id))); '

  var queryUsuario = 'CREATE OR REPLACE VIEW vw_usuario ' +
    'AS ' +
    'select dados_desnomalizado.nome AS nome,' +
    '(case when isnull(dados_desnomalizado.dt_nascimento) ' +
    'then NULL else dados_desnomalizado.dt_nascimento end) AS dt_nascimento,' +
    '(case when isnull(dados_desnomalizado.idade) then NULL ' +
    'else dados_desnomalizado.idade end) AS idade,' +
    '(case when isnull(dados_desnomalizado.sexo) then NULL ' +
    'else dados_desnomalizado.sexo end) AS sexo,' +
    '(case when isnull(dados_desnomalizado.municipio) then NULL ' +
    'else dados_desnomalizado.municipio end) AS municipio,' +
    '(case when isnull(dados_desnomalizado.estado) then NULL ' +
    'else dados_desnomalizado.estado end) AS estado,' +
    '(case when isnull(dados_desnomalizado.dt_cadastro) then NULL ' +
    'else dados_desnomalizado.dt_cadastro end) AS dt_acesso,\'novo\' AS tipo,' +
    'dados_desnomalizado.usuarioId AS usuarioId ' +
    'from dados_desnomalizado ' +
    'group by dados_desnomalizado.dt_cadastro,dados_desnomalizado.usuarioId ' +
    'union all ' +
    'select dados_desnomalizado.nome AS nome,' +
    '(case when isnull(dados_desnomalizado.dt_nascimento) then NULL ' +
    'else dados_desnomalizado.dt_nascimento end) AS dt_nascimento,' +
    '(case when isnull(dados_desnomalizado.idade) then NULL ' +
    'else dados_desnomalizado.idade end) AS idade,' +
    '(case when isnull(dados_desnomalizado.sexo) then NULL ' +
    'else dados_desnomalizado.sexo end) AS sexo,' +
    '(case when isnull(dados_desnomalizado.municipio) then NULL ' +
    'else dados_desnomalizado.municipio end) AS municipio,' +
    '(case when isnull(dados_desnomalizado.estado) then NULL ' +
    'else dados_desnomalizado.estado end) AS estado,' +
    'dados_desnomalizado.dt_acesso AS dt_acesso,\'atividade\' AS tipo,' +
    'dados_desnomalizado.usuarioId AS usuarioId ' +
    'from dados_desnomalizado ' +
    'group by dados_desnomalizado.dt_acesso,dados_desnomalizado.usuarioId;';

  var removeOld1 = 'DROP VIEW IF EXISTS vw_tags;'
  var removeOld2 = 'DROP VIEW IF EXISTS dados_desnomalizado;'
  var removeOld3 = 'DROP VIEW IF EXISTS vw_objeto_acesso;'
  var removeOld4 = 'DROP VIEW IF EXISTS vw_objeto_acesso_statics;'
  const promiseDelete = [];
  promiseDelete.push(knex.raw(removeOld1));
  promiseDelete.push(knex.raw(removeOld2));
  promiseDelete.push(knex.raw(removeOld3));
  promiseDelete.push(knex.raw(removeOld4));
  promiseDelete.push(knex.raw(queryAcesso));
  promiseDelete.push(knex.raw(queryDadosDesnomalizado));
  promiseDelete.push(knex.raw(queryTags));
  promiseDelete.push(knex.raw(queryUsuario));

  const psPromise = Promise.all(promiseDelete);
  return psPromise.then(function(usuarioPromise) {
    console.log(usuarioPromise);
  }).catch(function(error) {
    console.log('Error XXXXXXX', error);
  });
}

exports.down = function(knex, Promise) {
  var removeOld1 = 'DROP VIEW IF EXISTS vw_usuario;'
  var removeOld2 = 'DROP VIEW IF EXISTS vw_tags;'
  var removeOld3 = 'DROP VIEW IF EXISTS dados_desnomalizado;'
  var removeOld4 = 'DROP VIEW IF EXISTS vw_objeto_acesso_statics;'
  return knex.raw(removeOld1).then(function (errD1, resultDel1) {
    knex.raw(removeOld2).then(function (errD2, resultDel2) {
      knex.raw(removeOld3).then(function (errD2, resultDel3) {
        knex.raw(removeOld4).then(function (errD3, resultDel4) {
          console.log(resultDel1, resultDel2, resultDel3, resultDel4)
        })
      })
    })
  })
};
