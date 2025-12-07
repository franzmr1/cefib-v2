/**
 * Página: Reportes
 * Version: v2.0 - Con ExcelJS (seguro)
 */

'use client';

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Loader2
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { showToast } from '@/lib/toast';

export default function ReportesPage() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fin: '',
  });

  // Helper para descargar archivo
  const downloadExcel = async (workbook: ExcelJS.Workbook, fileName: string) => {
    const buffer = await workbook.xlsx. writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window. URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Estilizar header
  const styleHeader = (worksheet: ExcelJS.Worksheet) => {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;
  };

  // Exportar Cursos
  const exportarCursos = async () => {
    setIsExporting('cursos');
    try {
      const response = await fetch('/api/cursos/admin');
      if (!response.ok) throw new Error('Error al obtener cursos');

      const data = await response.json();
      const cursos = data.cursos;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cursos');

      // Definir columnas
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 38 },
        { header: 'Título', key: 'titulo', width: 40 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Modalidad', key: 'modalidad', width: 12 },
        { header: 'Duración (h)', key: 'duracionHoras', width: 12 },
        { header: 'Precio (S/)', key: 'precio', width: 12 },
        { header: 'Cupo Máximo', key: 'cupoMaximo', width: 12 },
        { header: 'Cupo Actual', key: 'cupoActual', width: 12 },
        { header: 'Fecha Inicio', key: 'fechaInicio', width: 15 },
        { header: 'Certificado', key: 'certificado', width: 12 },
        { header: 'Creado', key: 'createdAt', width: 15 },
      ];

      // Agregar datos
      cursos.forEach((curso: any) => {
        worksheet.addRow({
          id: curso.id,
          titulo: curso.titulo,
          estado: curso.estado,
          modalidad: curso.modalidad,
          duracionHoras: curso. duracionHoras,
          precio: curso.precio || 'Consultar',
          cupoMaximo: curso.cupoMaximo || 'Ilimitado',
          cupoActual: curso.cupoActual,
          fechaInicio: curso.fechaInicio ?  new Date(curso.fechaInicio).toLocaleDateString('es-PE') : '-',
          certificado: curso. certificado ?  'Sí' : 'No',
          createdAt: new Date(curso.createdAt).toLocaleDateString('es-PE'),
        });
      });

      // Estilizar
      styleHeader(worksheet);

      // Descargar
      const fileName = `cursos-${new Date().toISOString().split('T')[0]}.xlsx`;
      await downloadExcel(workbook, fileName);

      showToast. success(`✅ Reporte de ${cursos.length} cursos exportado`);
    } catch (error) {
      console.error('Error exportando cursos:', error);
      showToast.error('Error al exportar cursos');
    } finally {
      setIsExporting(null);
    }
  };

  // Exportar Participantes
  const exportarParticipantes = async () => {
    setIsExporting('participantes');
    try {
      const response = await fetch('/api/participantes');
      if (!response.ok) throw new Error('Error al obtener participantes');

      const data = await response.json();
      const participantes = data.participantes;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Participantes');

      worksheet.columns = [
        { header: 'Nombres', key: 'nombres', width: 20 },
        { header: 'Apellidos', key: 'apellidos', width: 20 },
        { header: 'Tipo Doc', key: 'tipoDocumento', width: 10 },
        { header: 'N° Documento', key: 'numeroDocumento', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Celular', key: 'celular', width: 15 },
        { header: 'Estado', key: 'estado', width: 10 },
        { header: 'N° Inscripciones', key: 'inscripciones', width: 15 },
        { header: 'Registrado', key: 'createdAt', width: 15 },
      ];

      participantes.forEach((p: any) => {
        worksheet.addRow({
          nombres: p.nombres,
          apellidos: p.apellidos,
          tipoDocumento: p.tipoDocumento,
          numeroDocumento: p.numeroDocumento,
          email: p.email,
          celular: p.celular || '-',
          estado: p. estado,
          inscripciones: p._count?. inscripciones || 0,
          createdAt: new Date(p.createdAt).toLocaleDateString('es-PE'),
        });
      });

      styleHeader(worksheet);

      const fileName = `participantes-${new Date().toISOString().split('T')[0]}.xlsx`;
      await downloadExcel(workbook, fileName);

      showToast.success(`✅ Reporte de ${participantes.length} participantes exportado`);
    } catch (error) {
      console.error('Error exportando participantes:', error);
      showToast.error('Error al exportar participantes');
    } finally {
      setIsExporting(null);
    }
  };

  // Exportar Inscripciones
  const exportarInscripciones = async () => {
    setIsExporting('inscripciones');
    try {
      let url = '/api/inscripciones';
      
      if (dateRange.inicio && dateRange.fin) {
        url += `?fechaInicio=${dateRange.inicio}&fechaFin=${dateRange.fin}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener inscripciones');

      const data = await response.json();
      const inscripciones = data.inscripciones;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Inscripciones');

      worksheet.columns = [
        { header: 'Código', key: 'codigo', width: 18 },
        { header: 'Participante', key: 'participante', width: 30 },
        { header: 'DNI', key: 'dni', width: 12 },
        { header: 'Curso', key: 'curso', width: 40 },
        { header: 'Fecha Inscripción', key: 'fechaInscripcion', width: 15 },
        { header: 'Estado Pago', key: 'estadoPago', width: 12 },
        { header: 'Monto Pagado', key: 'montoPagado', width: 12 },
        { header: 'Método Pago', key: 'metodoPago', width: 15 },
        { header: 'Fecha Pago', key: 'fechaPago', width: 15 },
        { header: 'Asistió', key: 'asistio', width: 10 },
      ];

      inscripciones. forEach((i: any) => {
        worksheet.addRow({
          codigo: i.codigo,
          participante: `${i.participante.nombres} ${i.participante.apellidos}`,
          dni: i. participante.numeroDocumento,
          curso: i.curso. titulo,
          fechaInscripcion: new Date(i. fechaInscripcion).toLocaleDateString('es-PE'),
          estadoPago: i. estadoPago,
          montoPagado: i.montoPagado || 0,
          metodoPago: i.metodoPago || '-',
          fechaPago: i.fechaPago ? new Date(i.fechaPago).toLocaleDateString('es-PE') : '-',
          asistio: i.asistio ?  'Sí' : 'No',
        });
      });

      styleHeader(worksheet);

      const fileName = `inscripciones-${new Date().toISOString().split('T')[0]}.xlsx`;
      await downloadExcel(workbook, fileName);

      showToast.success(`✅ Reporte de ${inscripciones.length} inscripciones exportado`);
    } catch (error) {
      console.error('Error exportando inscripciones:', error);
      showToast.error('Error al exportar inscripciones');
    } finally {
      setIsExporting(null);
    }
  };

  // Exportar Reporte Financiero
  const exportarReporteFinanciero = async () => {
    setIsExporting('financiero');
    try {
      const response = await fetch('/api/inscripciones');
      if (!response.ok) throw new Error('Error al obtener datos');

      const data = await response.json();
      const inscripciones = data.inscripciones;

      const totalIngresos = inscripciones
        .filter((i: any) => i.estadoPago === 'PAGADO')
        .reduce((sum: number, i: any) => sum + (i.montoPagado || 0), 0);

      const totalPendiente = inscripciones
        . filter((i: any) => i.estadoPago === 'PENDIENTE')
        .reduce((sum: number, i: any) => sum + (i.curso.precio || 0), 0);

      // Datos por curso
      const cursoStats: Record<string, any> = {};
      inscripciones.forEach((i: any) => {
        const cursoTitulo = i.curso.titulo;
        if (!cursoStats[cursoTitulo]) {
          cursoStats[cursoTitulo] = {
            inscritos: 0,
            pagados: 0,
            pendientes: 0,
            ingresos: 0,
          };
        }

        cursoStats[cursoTitulo].inscritos++;
        if (i.estadoPago === 'PAGADO') {
          cursoStats[cursoTitulo].pagados++;
          cursoStats[cursoTitulo].ingresos += i.montoPagado || 0;
        } else if (i.estadoPago === 'PENDIENTE') {
          cursoStats[cursoTitulo].pendientes++;
        }
      });

      const workbook = new ExcelJS. Workbook();

      // Hoja 1: Resumen General
      const wsResumen = workbook.addWorksheet('Resumen');
      wsResumen.columns = [
        { header: 'Métrica', key: 'metrica', width: 30 },
        { header: 'Valor', key: 'valor', width: 20 },
      ];

      wsResumen.addRow({ metrica: 'Total Inscripciones', valor: inscripciones.length });
      wsResumen.addRow({ metrica: 'Ingresos Confirmados', valor: `S/ ${totalIngresos. toFixed(2)}` });
      wsResumen.addRow({ metrica: 'Ingresos Pendientes', valor: `S/ ${totalPendiente.toFixed(2)}` });
      wsResumen.addRow({ metrica: 'Proyección Total', valor: `S/ ${(totalIngresos + totalPendiente).toFixed(2)}` });

      styleHeader(wsResumen);

      // Hoja 2: Por Curso
      const wsCursos = workbook.addWorksheet('Por Curso');
      wsCursos.columns = [
        { header: 'Curso', key: 'curso', width: 40 },
        { header: 'Inscritos', key: 'inscritos', width: 12 },
        { header: 'Pagados', key: 'pagados', width: 12 },
        { header: 'Pendientes', key: 'pendientes', width: 12 },
        { header: 'Ingresos (S/)', key: 'ingresos', width: 15 },
      ];

      Object.entries(cursoStats).forEach(([curso, stats]: [string, any]) => {
        wsCursos.addRow({
          curso,
          inscritos: stats. inscritos,
          pagados: stats.pagados,
          pendientes: stats.pendientes,
          ingresos: stats. ingresos. toFixed(2),
        });
      });

      styleHeader(wsCursos);

      const fileName = `reporte-financiero-${new Date().toISOString().split('T')[0]}.xlsx`;
      await downloadExcel(workbook, fileName);

      showToast.success('✅ Reporte financiero exportado');
    } catch (error) {
      console.error('Error exportando reporte financiero:', error);
      showToast.error('Error al exportar reporte financiero');
    } finally {
      setIsExporting(null);
    }
  };

  const reportes = [
    {
      id: 'cursos',
      titulo: 'Catálogo de Cursos',
      descripcion: 'Lista completa de cursos con detalles, estado y configuración',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      action: exportarCursos,
    },
    {
      id: 'participantes',
      titulo: 'Base de Participantes',
      descripcion: 'Datos de contacto y estadísticas de todos los participantes',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      action: exportarParticipantes,
    },
    {
      id: 'inscripciones',
      titulo: 'Registro de Inscripciones',
      descripcion: 'Historial completo de inscripciones y estados de pago',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      action: exportarInscripciones,
    },
    {
      id: 'financiero',
      titulo: 'Reporte Financiero',
      descripcion: 'Análisis de ingresos, pendientes y proyecciones por curso',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      action: exportarReporteFinanciero,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reportes</h1>
            <p className="text-gray-600 dark:text-gray-400">Exporta datos a Excel para análisis externo</p>
          </div>
        </div>

        {/* Filtros de Fecha */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Filtros Opcionales (Inscripciones)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={dateRange.inicio}
                onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Fecha Fin</label>
              <input
                type="date"
                value={dateRange. fin}
                onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Reportes */}
      <div className="grid md:grid-cols-2 gap-6">
        {reportes.map((reporte) => {
          const Icon = reporte. icon;
          const isLoading = isExporting === reporte.id;

          return (
            <div
              key={reporte.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`${reporte.bgColor} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${reporte.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {reporte.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {reporte.descripcion}
                </p>
              </div>

              <div className="p-6">
                <button
                  onClick={reporte.action}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${reporte.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Exportar a Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
          💡 Tip: Análisis de Datos
        </h3>
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          Los archivos Excel generados pueden abrirse en Microsoft Excel, Google Sheets o LibreOffice Calc.  
          Úsalos para crear tablas dinámicas, gráficos y análisis avanzados.
        </p>
      </div>
    </div>
  );
}