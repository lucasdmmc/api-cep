import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../services/api'

const formCepSchema = z.object({
  cep: z.string().nonempty('Campo obrigatório'),
  uf: z.string().nonempty('Campo obrigatório'),
  city: z.string().nonempty('Campo obrigatório'),
  ibge: z.string().nonempty('Campo obrigatório'),
})

type FormCepDataType = z.infer<typeof formCepSchema>

export const FormCep = () => {
  const { handleSubmit, register, setValue, watch } = useForm<FormCepDataType>({
    resolver: zodResolver(formCepSchema),
  })

  const cep = watch('cep')

  async function fetchApi(query: string) {
    const response = await api.get(`/ws/${query}/json/`)
    const { localidade, uf, ibge } = response.data
    setValue('uf', uf)
    setValue('city', localidade)
    setValue('ibge', ibge)
  }

  async function handleSubmitFormCep(data: FormCepDataType) {
    await fetchApi(data.cep)
  }

  useEffect(() => {
    if (cep && cep.length === 8) {
      fetchApi(cep)
    }
  }, [cep])

  return (
    <form
      onSubmit={handleSubmit(handleSubmitFormCep)}
      className="bg-zinc-300 p-4 max-w-[500px] rounded"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium mt-2" htmlFor="">
          CEP
        </label>
        <input
          className="rounded bg-transparent border border-zinc-400 px-4 text-sm outline-none p-1"
          type="text"
          placeholder="Digite seu cep"
          {...register('cep')}
          onChange={(e) => setValue('cep', e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium mt-2" htmlFor="">
          UF
        </label>
        <input
          className="rounded bg-transparent border border-zinc-400 px-4 text-sm outline-none p-1"
          type="text"
          placeholder="UF"
          {...register('uf')}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium mt-2" htmlFor="">
          Cidade
        </label>
        <input
          className="rounded bg-transparent border border-zinc-400 px-4 text-sm outline-none p-1"
          type="text"
          placeholder="Nome da cidade"
          {...register('city')}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium mt-2" htmlFor="">
          IBGE
        </label>
        <input
          className="rounded bg-transparent border border-zinc-400 px-4 text-sm outline-none p-1"
          type="text"
          placeholder="IBGE"
          {...register('ibge')}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 w-full p-1 mt-4 rounded text-white font-bold"
      >
        Buscar
      </button>
    </form>
  )
}
