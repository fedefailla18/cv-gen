import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Resume } from '../types';

// Register fonts for better typography (optional - uses system fonts if not available)
// You can add custom fonts later if needed

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 10,
    color: '#6b7280',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  contactItem: {
    marginRight: 10,
  },
  summary: {
    marginTop: 10,
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 20,
    minHeight: 50, // Minimum height to prevent awkward breaks
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb',
    color: '#111827',
    marginTop: 10,
  },
  workItem: {
    marginBottom: 15,
    minHeight: 40, // Keep work items together when possible
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  workPosition: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  workCompany: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  workDates: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  workSummary: {
    fontSize: 10,
    color: '#374151',
    marginTop: 5,
    lineHeight: 1.5,
  },
  highlights: {
    marginTop: 5,
    paddingLeft: 15,
  },
  highlightItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 10,
    minHeight: 30,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  educationInstitution: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  educationArea: {
    fontSize: 11,
    color: '#4b5563',
  },
  educationDates: {
    fontSize: 10,
    color: '#6b7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skillItem: {
    fontSize: 10,
    color: '#374151',
    marginRight: 10,
    marginBottom: 5,
  },
  languageItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 5,
  },
});

interface PDFDocumentProps {
  resume: Resume;
  sections: string[];
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ resume, sections }) => {
  const { basics, work = [], education = [], skills = [], languages = [] } = resume;

  const renderBasics = () => (
    <View style={styles.header}>
      <Text style={styles.name}>{basics.name}</Text>
      {basics.label && <Text style={styles.label}>{basics.label}</Text>}
      <View style={styles.contactInfo}>
        {basics.email && <Text style={styles.contactItem}>{basics.email}</Text>}
        {basics.phone && <Text style={styles.contactItem}>• {basics.phone}</Text>}
        {basics.url && <Text style={styles.contactItem}>• {basics.url}</Text>}
        {basics.location && (
          <Text style={styles.contactItem}>
            • {[basics.location.city, basics.location.region, basics.location.countryCode]
                .filter(Boolean)
                .join(', ')}
          </Text>
        )}
      </View>
      {basics.summary && <Text style={styles.summary}>{basics.summary}</Text>}
    </View>
  );

  const renderWork = () => {
    if (!work.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {work.map((w, i) => (
          <View key={i} style={styles.workItem}>
            <View style={styles.workHeader}>
              <View>
                <Text style={styles.workPosition}>{w.position || 'Position'}</Text>
                <Text style={styles.workCompany}>{w.name}</Text>
              </View>
              <Text style={styles.workDates}>
                {w.startDate} - {w.endDate || 'Present'}
              </Text>
            </View>
            {w.summary && <Text style={styles.workSummary}>{w.summary}</Text>}
            {w.highlights && w.highlights.length > 0 && (
              <View style={styles.highlights}>
                {w.highlights.map((h, idx) => (
                  <Text key={idx} style={styles.highlightItem}>
                    • {h}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!education.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((e, i) => (
          <View key={i} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <View>
                <Text style={styles.educationInstitution}>{e.institution}</Text>
                <Text style={styles.educationArea}>{e.area}</Text>
              </View>
              <Text style={styles.educationDates}>
                {e.startDate} - {e.endDate || 'Present'}
              </Text>
            </View>
            {e.location && (
              <Text style={{ fontSize: 10, color: '#6b7280' }}>{e.location}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!skills.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {skills.map((s, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 3 }}>
              {s.name}
              {s.level && ` - ${s.level}`}
            </Text>
            {s.keywords && s.keywords.length > 0 && (
              <View style={styles.skillsContainer}>
                {s.keywords.map((keyword, idx) => (
                  <Text key={idx} style={styles.skillItem}>
                    {keyword}
                    {idx < s.keywords!.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderLanguages = () => {
    if (!languages.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        {languages.map((l, i) => (
          <Text key={i} style={styles.languageItem}>
            {l.language} - {l.fluency || 'Proficient'}
          </Text>
        ))}
      </View>
    );
  };

  const renderSection = (section: string) => {
    switch (section) {
      case 'basics':
        return renderBasics();
      case 'work':
        return renderWork();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'languages':
        return renderLanguages();
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {sections.map((section) => (
          <React.Fragment key={section}>{renderSection(section)}</React.Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDocument;

