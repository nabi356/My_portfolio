from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from bs4 import BeautifulSoup

html_path = 'resume.html'
pdf_path = 'resume.pdf'

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Heading', fontSize=16, leading=20, spaceAfter=8, textColor='#ffffff'))
styles.add(ParagraphStyle(name='Body', fontSize=11, leading=15, spaceAfter=6, textColor='#ffffff'))

doc = SimpleDocTemplate(pdf_path, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
story = []

# Title
h1 = soup.find('h1')
if h1:
    story.append(Paragraph(h1.get_text(), styles['Heading']))

# Meta
meta = soup.find(class_='meta')
if meta:
    story.append(Paragraph(meta.get_text(), styles['Body']))
    story.append(Spacer(1, 8))

# Sections
for section in soup.select('.section'):
    h3 = section.find('h3')
    if h3:
        story.append(Paragraph(h3.get_text(), styles['Heading']))
    # paragraphs
    for p in section.find_all('p'):
        story.append(Paragraph(p.get_text(), styles['Body']))
    # lists
    for ul in section.find_all('ul'):
        for li in ul.find_all('li'):
            story.append(Paragraph('• ' + li.get_text(), styles['Body']))
    story.append(Spacer(1, 6))

# Footer line
story.append(Spacer(1, 8))

# Build PDF
try:
    doc.build(story)
    print('PDF generated:', pdf_path)
except Exception as e:
    print('Failed to generate PDF:', e)
