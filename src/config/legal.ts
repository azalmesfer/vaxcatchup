/** Single source of truth for legal text: footer, notices dialog, printed report and rules PDF. */
export interface Notice {
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  shortEn: string;
  shortAr: string;
}

export const DISCLAIMER: Notice = {
  titleEn: 'Clinical disclaimer',
  titleAr: 'إخلاء المسؤولية السريري',
  bodyEn:
    'This tool is an informational decision-support aid for licensed healthcare professionals. It does not replace clinical judgment, and it does not replace the official protocols, guidelines or national immunization schedule issued by the Ministry of Health or the Public Health Authority (Weqaya). The treating clinician remains responsible for verifying every date, dose and recommendation against the patient\u2019s record and the current official guidance before administering any vaccine.',
  bodyAr:
    'هذه الأداة وسيلة مساندة لدعم القرار ولأغراض معلوماتية، وهي موجهة للممارسين الصحيين المرخصين. ولا تغني عن الحكم السريري، ولا تحل محل البروتوكولات والأدلة وجدول التطعيمات الوطني الرسمية الصادرة عن وزارة الصحة أو هيئة الصحة العامة (وقاية). ويظل الممارس الصحي المعالج مسؤولاً عن التحقق من كل تاريخ وجرعة وتوصية مقابل سجل المريض والإرشادات الرسمية المعتمدة الحالية قبل إعطاء أي لقاح.',
  shortEn:
    'Decision-support aid for licensed healthcare professionals. Does not replace clinical judgment or official Ministry of Health protocols.',
  shortAr:
    'أداة مساندة لدعم القرار للممارسين الصحيين المرخصين، ولا تغني عن الحكم السريري أو بروتوكولات وزارة الصحة الرسمية.',
};

export const PRIVACY: Notice = {
  titleEn: 'Privacy notice',
  titleAr: 'إشعار الخصوصية',
  bodyEn:
    'All patient information you enter is processed and saved only inside this browser\u2019s local storage (IndexedDB) on this device. Nothing is sent to any server or cloud service, and the app has no accounts or tracking. Because the data stays on this device, clearing browser data deletes saved patients, and anyone with access to this browser profile can view them. Use a protected device and avoid shared computers.',
  bodyAr:
    'تتم معالجة جميع بيانات المرضى التي تدخلها وحفظها داخل مساحة التخزين المحلية للمتصفح (IndexedDB) على هذا الجهاز فقط. لا يتم إرسال أي بيانات إلى أي خادم أو خدمة سحابية، ولا يتضمن التطبيق حسابات أو أدوات تتبع. ولأن البيانات تبقى على هذا الجهاز، فإن مسح بيانات المتصفح يحذف المرضى المحفوظين، ويمكن لأي شخص يصل إلى ملف المتصفح هذا الاطلاع عليها. استخدم جهازاً محمياً وتجنب الأجهزة المشتركة.',
  shortEn: 'Generated and stored locally on this device. No patient data was transmitted.',
  shortAr: 'أُنشئ هذا التقرير وحُفظ محلياً على هذا الجهاز، ولم تُرسل أي بيانات للمريض خارجه.',
};
