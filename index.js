/*
    Algoritmo para automatizar a extração de vulnerabilidades através de uma API de um CVE.
    API Usada: https://cve.circl.lu/api/last

    Feito em Node por João Victor
*/

const axios = require("axios")
const nodemailer = require("nodemailer")

const consulting_cve = async () => {
    try {
        return await axios.get("https://cve.circl.lu/api/last")
    }
    catch (error) {
        throw new Error("Something is not correctly!\n" + error)
    }
}

const get_cve_data = async () => {
    try {
        const { data } = await consulting_cve()

        /* Gerando posições aleatórias */
        const random_first = () => Math.floor(Math.random() * 30)
        const random_second = () => Math.floor(Math.random() * 30)
        const random_third = () => Math.floor(Math.random() * 30)

        let first_position = random_first()
        let second_position = random_second()
        let third_position = random_third()

        if (first_position === second_position || second_position === third_position || third_position === first_position) {
            first_position = random_first()
            second_position = random_second()
            third_position = random_third()
        }

        /* 1° Referência */
        const first_ref = {
            assigner: data[first_position].assigner,
            published: data[first_position].Published,
            impact: {
                availability: data[first_position].impact.availability,
                confidentiality: data[first_position].impact.confidentiality,
                integrity: data[first_position].impact.integrity
            },
            references: data[first_position].references,
            summary: data[first_position].summary
        }

        /* 2° Referência */
        const second_ref = {
            assigner: data[second_position].assigner,
            published: data[second_position].Published,
            impact: {
                availability: data[second_position].impact.availability,
                confidentiality: data[second_position].impact.confidentiality,
                integrity: data[second_position].impact.integrity
            },
            references: data[second_position].references,
            summary: data[second_position].summary
        }

        /* 3° Referência */
        const third_ref = {
            assigner: data[third_position].assigner,
            published: data[third_position].Published,
            impact: {
                availability: data[third_position].impact.availability,
                confidentiality: data[third_position].impact.confidentiality,
                integrity: data[third_position].impact.integrity
            },
            references: data[third_position].references,
            summary: data[third_position].summary
        }

        return { first_ref, second_ref, third_ref }
    }
    catch (error) {
        throw new Error("Something is not correctly!\n" + error)
    }
}

const send_mail = async () => {
    try {
        const { first_ref, second_ref, third_ref } = await get_cve_data()

        const user = "Enter with your e-mail"
        const pass = "Enter with your password"

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: user,
                pass: pass
            }
        })

        const mailOptions = {
            from: user,
            to: "Enter e-mail to send",
            subject: "Relatório das Vulnerabilidades Recentes - Cybersecurity SOC",
            text: `Bom Dia!
            \nFoi extraida três vulnerabilidades do CVE na data de hoje, qualquer dúvida entre em contato.
            \n\n1° Vulnerabilidade:\nFonte: ${first_ref.assigner}\nData de publicação: ${first_ref.published}\nResumo: ${first_ref.summary}\nImpacto na Confidencialidade: ${first_ref.impact.confidentiality}\nImpacto na Integridade: ${first_ref.impact.integrity}\nImpacto na Disponibilidade: ${first_ref.impact.availability}\nReferências: ${first_ref.references}
            \n\n2° Vulnerabilidade:\nFonte: ${second_ref.assigner}\nData de publicação: ${second_ref.published}\nResumo: ${second_ref.summary}\nImpacto na Confidencialidade: ${second_ref.impact.confidentiality}\nImpacto na Integridade: ${second_ref.impact.integrity}\nImpacto na Disponibilidade: ${second_ref.impact.availability}\nReferências: ${second_ref.references}
            \n\n3° Vulnerabilidade:\nFonte: ${third_ref.assigner}\nData de publicação: ${third_ref.published}\nResumo: ${third_ref.summary}\nImpacto na Confidencialidade: ${third_ref.impact.confidentiality}\nImpacto na Integridade: ${third_ref.impact.integrity}\nImpacto na Disponibilidade: ${third_ref.impact.availability}\nReferências: ${third_ref.references}
            \n\nDefinições:
            \n* COMPLETE significa que está ocorrencia está no nível de maior risco.
            \n* PARTIAL significa que está ocorrencia está em um nível aceitável, mas ainda oferece risco.
            \n* NONE significa que está ocorrencia está em um nível que não oferece risco.`
        }

        transporter.sendMail(mailOptions, (err, inf) => {
            if (err) {
                console.log("Gave error!\n" + err)
            }
            else {
                console.log("Email was send!")
            }
        })
    }
    catch (error) {
        throw new Error("Something is not correctly!\n" + error)
    }
}

let time = 0

const interval = setInterval(() => {
    if (time === 86400000) {
        time = 0
        send_mail()
    }
    else {
        time++
    }
}, 1000)