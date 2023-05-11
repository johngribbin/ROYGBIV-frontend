<!-- <script lang="ts">
  async function createPrism(prism: Prism) {
    const { label, members } = prism

    const params = {
      label,
      members: members.map((member) => ({
        name: member.name,
        destination: member.destination,
        split: member.split
      }))
    }

    try {
      const result = await request('createprism', params)
      console.log(
        `
      
      PRISM METHOD RESPONSE =
      
      `,
        result,
        `
      
      `
      )
      bolt12 = (result as { bolt12: string }).bolt12
      modalState$.next('qr')
    } catch (error) {
      console.log(
        `
      
      PRISM METHOD ERROR = 
      
      `,
        error,
        `
      
      `
      )
    }
  }
</script>

<PrismSteps finish={(prism) => createPrism(prism)} /> -->

<div>CREATE PAGE HERE</div>
