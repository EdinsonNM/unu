module.exports={
	Actividadacademica: require('./ActividadacademicaController')(),
	Aula: require('./AulaController')(),
	Curso: require('./CursoController')(),
	Distribucionaula: require('./DistribucionaulaController')(),
	Distribucionauladetalle: require('./DistribucionauladetalleController')(),
	Docente: require('./DocenteController')(),
	Pabellon: require('./PabellonController')(),
	Periodo: require('./PeriodoController')(),
	Planestudio: require('./PlanestudioController')(),
	Planestudiodetalle: require('./PlanestudiodetalleController')(),
	Planestudiodetallegrupo: require('./PlanestudiodetallegrupoController')(),
	Plazaasignatura: require('./PlazaasignaturaController')(),
	Plaza: require('./PlazaController')(),
	Prerequisito: require('./PrerequisitoController')(),
	Requisito: require('./RequisitoController')(),
	Tipocurso: require('./TipocursoController')(),
	Tipoplaza: require('./TipoplazaController')(),


  Facultad: require('./FacultadController')(),
  Escuela: require('./EscuelaController')(),
  Usuario: require('./UsuarioController')(),
	Grupo:require('./GrupoController')()
}
