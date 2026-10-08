import { useContext, useEffect } from "react"
import { useParams } from "react-router"
import { InterviewContext } from "../interviewContext"
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (err) {
            setError(err.response?.data?.message || "Unable to generate your interview plan. Please try again.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport ?? null
    }

    const getReportById = async (id) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getInterviewReportById(id)
            setReport(response.interviewReport)
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load this interview plan.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport ?? null
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load your interview plans.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReports ?? []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError(null)
        try {
            const blob = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch {
            setError("Unable to generate the resume PDF. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId])

    return { loading, error, report, reports, generateReport, getReportById, getReports, getResumePdf }
}