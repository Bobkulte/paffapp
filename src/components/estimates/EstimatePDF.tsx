import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Estimate, CompanyInfo } from '@/models/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#c45f1f',
  },
  companyInfo: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.5,
  },
  clientBlock: {
    alignSelf: 'flex-end',
    backgroundColor: '#f6f6f6',
    padding: 15,
    borderRadius: 4,
    width: 200,
  },
  clientLabel: {
    fontSize: 8,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase' as const,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  metaItem: {
    fontSize: 9,
    color: '#666',
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3d3d3d',
    padding: 8,
    color: '#fff',
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase' as const,
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  colDesignation: { flex: 3 },
  colQte: { width: 50, textAlign: 'right' as const },
  colUnite: { width: 50, textAlign: 'center' as const },
  colPU: { width: 70, textAlign: 'right' as const },
  colTotal: { width: 80, textAlign: 'right' as const },
  totalsBlock: {
    alignSelf: 'flex-end',
    width: 220,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
  },
  totalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  totalTTC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#c45f1f',
    marginTop: 4,
  },
  totalTTCLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  totalTTCValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#c45f1f',
  },
  notes: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fdf8f0',
    borderRadius: 4,
    fontSize: 9,
    color: '#666',
    lineHeight: 1.5,
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
    paddingTop: 8,
  },
});

interface EstimatePDFProps {
  estimate: Estimate;
  company: CompanyInfo;
}

export default function EstimatePDF({ estimate, company }: EstimatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={styles.companyInfo}>
              {company.address && <Text>{company.address}</Text>}
              {(company.zipCode || company.city) && (
                <Text>{company.zipCode} {company.city}</Text>
              )}
              {company.phone && <Text>Tél : {company.phone}</Text>}
              {company.email && <Text>{company.email}</Text>}
            </View>
          </View>
          <View style={styles.clientBlock}>
            <Text style={styles.clientLabel}>Client</Text>
            <Text style={styles.clientName}>{estimate.clientName}</Text>
            {estimate.clientAddress && <Text>{estimate.clientAddress}</Text>}
            {(estimate.clientZipCode || estimate.clientCity) && (
              <Text>{estimate.clientZipCode} {estimate.clientCity}</Text>
            )}
            {estimate.clientEmail && <Text>{estimate.clientEmail}</Text>}
            {estimate.clientPhone && <Text>{estimate.clientPhone}</Text>}
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaItem}>Référence</Text>
            <Text style={styles.metaValue}>{estimate.reference}</Text>
          </View>
          <View>
            <Text style={styles.metaItem}>Date</Text>
            <Text style={styles.metaValue}>
              {new Date(estimate.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          {estimate.validityDate && (
            <View>
              <Text style={styles.metaItem}>Validité</Text>
              <Text style={styles.metaValue}>
                {new Date(estimate.validityDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesignation]}>Désignation</Text>
            <Text style={[styles.tableHeaderText, styles.colQte]}>Qté</Text>
            <Text style={[styles.tableHeaderText, styles.colUnite]}>Unité</Text>
            <Text style={[styles.tableHeaderText, styles.colPU]}>PU HT</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total HT</Text>
          </View>
          {estimate.lines.map((line, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={styles.colDesignation}>{line.designation}</Text>
              <Text style={styles.colQte}>{line.quantity}</Text>
              <Text style={styles.colUnite}>{line.unit}</Text>
              <Text style={styles.colPU}>{line.unitPrice.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{line.totalHT.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{estimate.totalHT.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({estimate.tvaRate}%)</Text>
            <Text style={styles.totalValue}>{estimate.totalTVA.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalTTC}>
            <Text style={styles.totalTTCLabel}>Total TTC</Text>
            <Text style={styles.totalTTCValue}>{estimate.totalTTC.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Notes */}
        {estimate.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes et conditions</Text>
            <Text>{estimate.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            {company.name} — SIRET : {company.siret || 'N/A'} — N° TVA : {company.tvaNumber || 'N/A'}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
