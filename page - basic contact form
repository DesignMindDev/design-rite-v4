[1mdiff --git a/app/careers/page.tsx b/app/careers/page.tsx[m
[1mindex 01eabbb..5697b19 100644[m
[1m--- a/app/careers/page.tsx[m
[1m+++ b/app/careers/page.tsx[m
[36m@@ -16,25 +16,8 @@[m [minterface ApplicationFormProps {[m
   onClose: () => void;[m
 }[m
 [m
[31m-function ApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {[m
[31m-  const [formData, setFormData] = useState({[m
[31m-    firstName: '',[m
[31m-    lastName: '',[m
[31m-    email: '',[m
[31m-    phone: '',[m
[31m-    linkedinUrl: '',[m
[31m-    portfolioUrl: '',[m
[31m-    yearsExperience: '',[m
[31m-    currentCompany: '',[m
[31m-    currentJobTitle: '',[m
[31m-    coverLetter: '',[m
[31m-    salaryExpectations: '',[m
[31m-    availableStartDate: '',[m
[31m-    referralSource: ''[m
[31m-  })[m
[31m-[m
[31m-  const [resumeFile, setResumeFile] = useState<File | null>(null)[m
[31m-  const [uploading, setUploading] = useState(false)[m
[32m+[m[32mconst [resumeFile, setResumeFile] = useState<File | null>(null)[m
[32m+[m[32m  const [isSubmitting, setIsSubmitting] = useState(false)[m
   const [submitted, setSubmitted] = useState(false)[m
   const [error, setError] = useState('')[m
 [m
[36m@@ -61,48 +44,29 @@[m [mfunction ApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {[m
     }[m
   }[m
 [m
[31m-  const uploadResume = async (file: File, applicantEmail: string) => {[m
[31m-    const fileExt = 'pdf'[m
[31m-    const fileName = `${applicantEmail}-${Date.now()}.${fileExt}`[m
[31m-    const filePath = `resumes/${fileName}`[m
[31m-[m
[31m-    const { data, error } = await supabase.storage[m
[31m-      .from('resumes')[m
[31m-      .upload(filePath, file)[m
[31m-[m
[31m-    if (error) {[m
[31m-      throw error[m
[31m-    }[m
[31m-[m
[31m-    const { data: { publicUrl } } = supabase.storage[m
[31m-      .from('resumes')[m
[31m-      .getPublicUrl(filePath)[m
[31m-[m
[31m-    return publicUrl[m
[31m-  }[m
[31m-[m
   const handleSubmit = async (e: React.FormEvent) => {[m
     e.preventDefault()[m
[31m-    setUploading(true)[m
[32m+[m[32m    setIsSubmitting(true)[m
     setError('')[m
 [m
     try {[m
[31m-      let resumeUrl = ''[m
[31m-[m
[32m+[m[32m      // Create FormData for file upload[m
[32m+[m[32m      const submitData = new FormData()[m
[32m+[m[41m      [m
[32m+[m[32m      // Add all form fields[m
[32m+[m[32m      Object.entries(formData).forEach(([key, value]) => {[m
[32m+[m[32m        submitData.append(key, value)[m
[32m+[m[32m      })[m
[32m+[m[41m      [m
[32m+[m[32m      submitData.append('positionApplied', position)[m
[32m+[m[41m      [m
       if (resumeFile) {[m
[31m-        resumeUrl = await uploadResume(resumeFile, formData.email)[m
[32m+[m[32m        submitData.append('resume', resumeFile)[m
       }[m
 [m
       const response = await fetch('/api/careers/apply', {[m
         method: 'POST',[m
[31m-        headers: {[m
[31m-          'Content-Type': 'application/json',[m
[31m-        },[m
[31m-        body: JSON.stringify({[m
[31m-          ...formData,[m
[31m-          positionApplied: position,[m
[31m-          resumeUrl: resumeUrl[m
[31m-        }),[m
[32m+[m[32m        body: submitData,[m
       })[m
 [m
       if (!response.ok) {[m
[36m@@ -112,9 +76,9 @@[m [mfunction ApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {[m
 [m
       setSubmitted(true)[m
     } catch (err: any) {[m
[31m-      setError(err.message || 'Failed to submit application')[m
[32m+[m[32m      setError(err.message || 'Failed to submit application. Please try again.')[m
     } finally {[m
[31m-      setUploading(false)[m
[32m+[m[32m      setIsSubmitting(false)[m
     }[m
   }[m
 [m
[36m@@ -360,10 +324,10 @@[m [mfunction ApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {[m
             </button>[m
             <button[m
               type="submit"[m
[31m-              disabled={uploading}[m
[32m+[m[32m              disabled={isSubmitting}[m
               className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"[m
             >[m
[31m-              {uploading ? 'Submitting...' : 'Submit Application'}[m
[32m+[m[32m              {isSubmitting ? 'Submitting...' : 'Submit Application'}[m
             </button>[m
           </div>[m
         </form>[m
[36m@@ -914,7 +878,7 @@[m [mexport default function CareersPage() {[m
             <div className="flex gap-4 mt-4 md:mt-0">[m
               <a href="mailto:careers@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>[m
               <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>[m
[31m-              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>[m
[32m+[m[32m              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🦎</Link>[m
             </div>[m
           </div>[m
         </div>[m
